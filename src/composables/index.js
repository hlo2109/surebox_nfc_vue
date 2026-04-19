/**
 * Composables Index
 * Central export point for all composables
 */

import { useAuth } from './useAuth';
import { useNfc } from './useNfc';
import { useNfcReader } from './useNfcReader';
import { useCompanies } from './useCompanies';
import { useServices } from './useServices';
import { useServiceRequests } from './useServiceRequests';
import { useToast } from './useToast';
import { usePermissions } from './usePermissions';
import { useLocation } from './useLocation';
import { useEmployeeAssignments } from './useEmployeeAssignments';
import { useQuoteAiAssist } from './useQuoteAiAssist';

export { useAuth, useNfc, useNfcReader, useCompanies, useServices, useServiceRequests, useToast, usePermissions, useLocation, useEmployeeAssignments, useQuoteAiAssist };

export default {
	useAuth,
	useNfc,
	useNfcReader,
	useCompanies,
	useServices,
	useServiceRequests,
	useToast,
	usePermissions,
	useLocation,
	useEmployeeAssignments,
	useQuoteAiAssist,
};
