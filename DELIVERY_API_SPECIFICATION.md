# Delivery API Specification

## Overview
This document describes the API endpoint requirements for the improved deliveries page with server-side filtering and pagination.

## Endpoint: GET /delivery

### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `page` | integer | No | Current page number (default: 1) | `page=2` |
| `per_page` | integer | No | Items per page (default: 10) | `per_page=25` |
| `search` | string | No | Search by package ID | `search=PKG123` |
| `status` | string | No | Filter by delivery status | `status=delivered` |
| `company` | string | No | Filter by company name | `company=DHL` |
| `date_range` | string | No | Predefined date range | `date_range=week` |
| `date_from` | date | No | Custom start date (ISO format) | `date_from=2025-11-01` |
| `date_to` | date | No | Custom end date (ISO format) | `date_to=2025-11-11` |
| `sort_by` | string | No | Sort order | `sort_by=date-desc` |

### Date Range Options
- `today` - Deliveries from today
- `week` - Deliveries from last 7 days
- `month` - Deliveries from last 30 days
- `custom` - Use `date_from` and `date_to` parameters

### Sort Options
- `date-desc` - Newest first (default)
- `date-asc` - Oldest first
- `company` - Sort by company name (A-Z)
- `status` - Sort by status

### Status Options
- `delivered` - Package has been delivered
- `in_transit` - Package is in transit
- `pending` - Package is pending

## Response Format

### Success Response (200 OK)

```json
{
  "data": [
    {
      "id": 1,
      "package_id": "PKG123456",
      "state": "delivered",
      "delivery_time": "2025-11-10T14:30:00Z",
      "company": {
        "id": 1,
        "name": "DHL"
      },
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "info": {
        "location": {
          "lat": "-33.8688",
          "lng": "151.2093"
        }
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total_pages": 5,
    "total": 48
  }
}
```

### Response Fields

#### Data Array
Each delivery object should contain:
- `id` - Unique delivery identifier
- `package_id` - Package tracking number
- `state` - Current delivery status
- `delivery_time` - ISO 8601 timestamp
- `company` - Object with company details
  - `id` - Company identifier
  - `name` - Company name
- `user` - Object with recipient details
  - `id` - User identifier
  - `name` - User full name
  - `email` - User email
- `info` - Optional tracking information
  - `location` - Optional GPS coordinates
    - `lat` - Latitude
    - `lng` - Longitude

#### Pagination Object
- `current_page` - Current page number
- `per_page` - Items per page
- `total_pages` - Total number of pages
- `total` - Total number of records

## Example Requests

### 1. Get First Page (Default)
```
GET /delivery
```

### 2. Get Specific Page with 25 Items
```
GET /delivery?page=2&per_page=25
```

### 3. Search for Package
```
GET /delivery?search=PKG123
```

### 4. Filter by Status and Company
```
GET /delivery?status=delivered&company=DHL
```

### 5. Filter by Date Range
```
GET /delivery?date_range=week
```

### 6. Filter by Custom Date Range
```
GET /delivery?date_range=custom&date_from=2025-11-01&date_to=2025-11-10
```

### 7. Combined Filters with Sorting
```
GET /delivery?status=in_transit&company=FedEx&sort_by=date-desc&page=1&per_page=25
```

## Backend Implementation Notes

### Database Query Optimization
1. **Indexing**: Create indexes on frequently queried columns:
   - `package_id` (for search)
   - `state` (for status filter)
   - `delivery_time` (for date filtering and sorting)
   - `company_id` (for company filter)

2. **Pagination**: Use LIMIT and OFFSET for efficient pagination:
   ```sql
   LIMIT per_page OFFSET (page - 1) * per_page
   ```

3. **Search**: Use case-insensitive search for package_id:
   ```sql
   WHERE LOWER(package_id) LIKE LOWER('%search%')
   ```

4. **Date Filtering**: Use appropriate date functions:
   ```sql
   -- For 'today'
   WHERE DATE(delivery_time) = CURRENT_DATE
   
   -- For 'week'
   WHERE delivery_time >= NOW() - INTERVAL 7 DAY
   
   -- For 'month'
   WHERE delivery_time >= NOW() - INTERVAL 30 DAY
   
   -- For custom range
   WHERE delivery_time BETWEEN date_from AND date_to
   ```

### Performance Considerations
- Implement query result caching for frequently accessed data
- Use eager loading for related models (company, user)
- Consider adding a total count cache to avoid counting on every request
- Implement query timeout limits for complex filters

### Example Laravel/PHP Backend Implementation

```php
public function index(Request $request)
{
    $query = Delivery::with(['company', 'user']);
    
    // Search filter
    if ($request->has('search')) {
        $query->where('package_id', 'LIKE', '%' . $request->search . '%');
    }
    
    // Status filter
    if ($request->has('status')) {
        $query->where('state', $request->status);
    }
    
    // Company filter
    if ($request->has('company')) {
        $query->whereHas('company', function($q) use ($request) {
            $q->where('name', $request->company);
        });
    }
    
    // Date range filter
    if ($request->has('date_range')) {
        switch ($request->date_range) {
            case 'today':
                $query->whereDate('delivery_time', today());
                break;
            case 'week':
                $query->where('delivery_time', '>=', now()->subDays(7));
                break;
            case 'month':
                $query->where('delivery_time', '>=', now()->subDays(30));
                break;
            case 'custom':
                if ($request->has('date_from') && $request->has('date_to')) {
                    $query->whereBetween('delivery_time', [
                        $request->date_from,
                        $request->date_to . ' 23:59:59'
                    ]);
                }
                break;
        }
    }
    
    // Sorting
    $sortBy = $request->input('sort_by', 'date-desc');
    switch ($sortBy) {
        case 'date-asc':
            $query->orderBy('delivery_time', 'asc');
            break;
        case 'company':
            $query->join('companies', 'deliveries.company_id', '=', 'companies.id')
                  ->orderBy('companies.name', 'asc');
            break;
        case 'status':
            $query->orderBy('state', 'asc');
            break;
        default: // date-desc
            $query->orderBy('delivery_time', 'desc');
            break;
    }
    
    // Pagination
    $perPage = $request->input('per_page', 10);
    $deliveries = $query->paginate($perPage);
    
    return response()->json([
        'data' => $deliveries->items(),
        'pagination' => [
            'current_page' => $deliveries->currentPage(),
            'per_page' => $deliveries->perPage(),
            'total_pages' => $deliveries->lastPage(),
            'total' => $deliveries->total()
        ]
    ]);
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid parameter",
  "message": "The per_page parameter must be between 1 and 100"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 500 Internal Server Error
```json
{
  "error": "Server error",
  "message": "An unexpected error occurred"
}
```

## Migration Notes

### Backward Compatibility
The API maintains backward compatibility. If no pagination parameters are provided, you can return all results in the old format:

```json
[
  {
    "id": 1,
    "package_id": "PKG123",
    ...
  }
]
```

The frontend will handle both formats automatically.

## Testing Checklist

- [ ] Test pagination with various page numbers
- [ ] Test all filter combinations
- [ ] Test search functionality
- [ ] Test date range filtering (today, week, month, custom)
- [ ] Test sorting options
- [ ] Test invalid parameters (should return appropriate errors)
- [ ] Test with empty result sets
- [ ] Test with large datasets (performance)
- [ ] Test authentication/authorization
- [ ] Test concurrent requests
