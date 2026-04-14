import { ref } from 'vue';
import { getCountries, getDepartments, getCities } from '@/api/location.api';

/**
 * useLocation composable
 * Manages cascading location state: Country → Department → City
 * Uses the endpoints:
 *   GET /countries
 *   GET /departments?countryId=:id
 *   GET /cities?departmentId=:id
 */
export const useLocation = () => {
	// ---- Lists ----
	const countries = ref([]);
	const departments = ref([]);
	const cities = ref([]);

	// ---- Loading states ----
	const loadingCountries = ref(false);
	const loadingDepartments = ref(false);
	const loadingCities = ref(false);

	// ---- Error ----
	const error = ref(null);

	// ---- Fetch methods ----

	/**
	 * Fetch all active countries
	 */
	const fetchCountries = async () => {
		loadingCountries.value = true;
		error.value = null;
		try {
			const response = await getCountries();
			const raw = response?.data ?? response;
			countries.value = Array.isArray(raw) ? raw : [];
		} catch (err) {
			error.value = err.message;
			countries.value = [];
		} finally {
			loadingCountries.value = false;
		}
	};

	/**
	 * Fetch departments that belong to a given country.
	 * Clears the departments list if no countryId is provided.
	 * @param {number|null} countryId
	 */
	const fetchDepartments = async (countryId) => {
		if (!countryId) {
			departments.value = [];
			return;
		}
		loadingDepartments.value = true;
		error.value = null;
		try {
			const response = await getDepartments(countryId);
			const raw = response?.data ?? response;
			departments.value = Array.isArray(raw) ? raw : [];
		} catch (err) {
			error.value = err.message;
			departments.value = [];
		} finally {
			loadingDepartments.value = false;
		}
	};

	/**
	 * Fetch cities that belong to a given department.
	 * Clears the cities list if no departmentId is provided.
	 * @param {number|null} departmentId
	 */
	const fetchCities = async (departmentId) => {
		if (!departmentId) {
			cities.value = [];
			return;
		}
		loadingCities.value = true;
		error.value = null;
		try {
			const response = await getCities(departmentId);
			const raw = response?.data ?? response;
			cities.value = Array.isArray(raw) ? raw : [];
		} catch (err) {
			error.value = err.message;
			cities.value = [];
		} finally {
			loadingCities.value = false;
		}
	};

	/**
	 * Initialise the full location chain for edit / pre-fill scenarios.
	 * Loads departments and cities in sequence without triggering cascade resets,
	 * then sets the provided IDs.
	 *
	 * @param {object} opts
	 * @param {number|null} opts.countryId
	 * @param {number|null} opts.departmentId
	 * @param {number|null} opts.cityId
	 * @returns {{ countryId, departmentId, cityId }} – the resolved IDs
	 */
	const initLocation = async ({ countryId = null, departmentId = null, cityId = null } = {}) => {
		if (!countries.value.length) {
			await fetchCountries();
		}
		if (countryId) {
			await fetchDepartments(countryId);
		}
		if (departmentId) {
			await fetchCities(departmentId);
		}
		return { countryId, departmentId, cityId };
	};

	/**
	 * Helper – resolve human-readable names for a set of IDs from the
	 * currently loaded lists.
	 *
	 * @param {number|null} countryId
	 * @param {number|null} departmentId
	 * @param {number|null} cityId
	 * @returns {{ countryName, countryCode, departmentName, departmentCode, cityName, cityCode }}
	 */
	const getLocationNames = (countryId, departmentId, cityId) => {
		const country = countries.value.find(c => c.id === countryId);
		const department = departments.value.find(d => d.id === departmentId);
		const city = cities.value.find(c => c.id === cityId);

		return {
			countryName: country?.name || '',
			countryCode: country?.code || '',
			departmentName: department?.name || '',
			departmentCode: department?.code || '',
			cityName: city?.name || '',
			cityCode: city?.code || '',
		};
	};

	return {
		// Lists
		countries,
		departments,
		cities,

		// Loading flags
		loadingCountries,
		loadingDepartments,
		loadingCities,

		// Error
		error,

		// Methods
		fetchCountries,
		fetchDepartments,
		fetchCities,
		initLocation,
		getLocationNames,
	};
};

export default useLocation;
