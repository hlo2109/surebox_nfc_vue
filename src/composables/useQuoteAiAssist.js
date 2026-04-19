import { ref } from "vue";
import {
	buildProfessionalQuoteMessageEsp,
	buildAlternateProfessionalQuoteMessageEsp,
} from "@/utils/quoteEmailTemplates";

/**
 * Asistente para el mensaje de cotización (plantilla + IA opcional).
 *
 * IA real: define `VITE_QUOTE_AI_URL` (POST JSON). El servidor debe devolver
 * `{ "text": "..." }` o `{ "content": "..." }`. Opcional: `VITE_QUOTE_AI_KEY`
 * como Bearer si tu proxy lo exige.
 *
 * Sin URL: el botón “IA” aplica una variante alternativa de plantilla y avisa con toast.
 */
export function useQuoteAiAssist() {
	const quoteAiGenerating = ref(false);

	function buildContext(request, companyName, totalPrice) {
		return {
			language: "es",
			kind: "service_quote_email",
			customerName:
				request?.customerName ||
				request?.customer?.name ||
				request?.user?.name ||
				"",
			serviceName:
				request?.serviceName || request?.service?.name || "",
			companyName: companyName || "",
			totalPrice: totalPrice ?? "",
			requestNotes: request?.notes || request?.description || "",
		};
	}

	function applyTemplateEsp(request, companyName, totalPrice) {
		const ctx = buildContext(request, companyName, totalPrice);
		return buildProfessionalQuoteMessageEsp({
			customerName: ctx.customerName,
			serviceName: ctx.serviceName,
			companyName: ctx.companyName,
			totalPrice: ctx.totalPrice,
			requestNotes: ctx.requestNotes,
		});
	}

	async function composeWithAiEsp({
		request,
		companyName,
		totalPrice,
		setDetails,
		toast,
	}) {
		const ctx = buildContext(request, companyName, totalPrice);
		const aiUrl = import.meta.env.VITE_QUOTE_AI_URL?.trim();

		if (!aiUrl) {
			const alt = buildAlternateProfessionalQuoteMessageEsp({
				customerName: ctx.customerName,
				serviceName: ctx.serviceName,
				companyName: ctx.companyName,
				totalPrice: ctx.totalPrice,
				requestNotes: ctx.requestNotes,
			});
			setDetails(alt);
			toast.showInfo(
				"Sin VITE_QUOTE_AI_URL se aplicó una variante alternativa de redacción. Configure el endpoint para usar su modelo de IA.",
			);
			return { ok: true, mode: "local_variant" };
		}

		quoteAiGenerating.value = true;
		try {
			const headers = { "Content-Type": "application/json" };
			const key = import.meta.env.VITE_QUOTE_AI_KEY?.trim();
			if (key) {
				headers.Authorization = `Bearer ${key}`;
			}
			const res = await fetch(aiUrl, {
				method: "POST",
				headers,
				body: JSON.stringify({ context: ctx }),
			});
			if (!res.ok) {
				throw new Error(`HTTP ${res.status}`);
			}
			const data = await res.json();
			const text =
				(typeof data?.text === "string" && data.text) ||
				(typeof data?.content === "string" && data.content) ||
				(typeof data?.message === "string" && data.message) ||
				"";
			if (!text.trim()) {
				throw new Error("Respuesta vacía del servicio de IA");
			}
			setDetails(text.trim());
			toast.showSuccess("Texto generado con IA insertado en el mensaje.");
			return { ok: true, mode: "remote" };
		} catch (e) {
			const fallback = buildAlternateProfessionalQuoteMessageEsp({
				customerName: ctx.customerName,
				serviceName: ctx.serviceName,
				companyName: ctx.companyName,
				totalPrice: ctx.totalPrice,
				requestNotes: ctx.requestNotes,
			});
			setDetails(fallback);
			toast.showError(
				e?.message
					? `IA no disponible (${e.message}). Se insertó variante local.`
					: "IA no disponible. Se insertó variante local.",
			);
			return { ok: false, mode: "fallback" };
		} finally {
			quoteAiGenerating.value = false;
		}
	}

	return {
		quoteAiGenerating,
		applyTemplateEsp,
		composeWithAiEsp,
	};
}
