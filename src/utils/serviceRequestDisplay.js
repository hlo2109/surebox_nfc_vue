/**
 * Normalise service request payloads from the API for UI.
 * List/detail responses use flat fields (serviceName, companyName, notes)
 * and `location` as an object (NFC box), not nested `service` / string location.
 */

export function requestServiceName(req) {
	return req?.serviceName || req?.service?.name || "Service Request";
}

export function requestCompanyName(req) {
	return req?.companyName || req?.service?.company?.name || "";
}

export function requestNotes(req) {
	return String(req?.notes ?? req?.description ?? "").trim();
}

export function formatRequestLocation(req) {
	const loc = req?.location;
	if (loc == null || loc === "") return "";
	if (typeof loc === "string") return loc;
	if (typeof loc === "object") {
		const nick = loc.nickname || loc.name || "";
		const addr = loc.address || "";
		if (nick && addr) return `${nick} · ${addr}`;
		return nick || addr || "";
	}
	return String(loc);
}

export function requestPricingMode(req) {
	return req?.pricingMode ?? req?.pricing_mode ?? "fixed";
}

export function isQuotePricingRequest(req) {
	return requestPricingMode(req) === "quote";
}

/**
 * Normalise assignment rows from GET /service-requests/:id (assignments[])
 * or a single `assignment` object from some list views.
 */
export function listRequestAssignments(req) {
	if (!req) return [];
	const list = req.assignments;
	if (Array.isArray(list) && list.length) {
		return list.map(normalizeAssignmentRow).filter(Boolean);
	}
	if (req.assignment) {
		const one = normalizeAssignmentRow(req.assignment);
		return one ? [one] : [];
	}
	return [];
}

function normalizeAssignmentRow(a) {
	if (!a || typeof a !== "object") return null;
	return {
		uuid: a.uuid,
		employeeName:
			a.employee?.name ??
			a.employee_name ??
			a.employeeName ??
			"Unknown",
		employeeEmail: a.employee?.email ?? a.email ?? null,
		employeePhone: a.employee?.phone ?? a.phone ?? null,
		status: a.status || "assigned",
		assignedAt:
			a.assignedDate ??
			a.assignedAt ??
			a.assigned_at ??
			null,
	};
}

export function assignmentStatusLabel(status) {
	const s = status || "pending";
	return String(s)
		.replace(/_/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function assignmentBadgeClassFor(status) {
	const map = {
		completed:
			"inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800",
		in_progress:
			"inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800",
		cancelled:
			"inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800",
	};
	return (
		map[status] ||
		"inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800"
	);
}
