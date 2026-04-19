/**
 * Textos tipo correo / presentación para cotizaciones (ES).
 * Se usan en el modal de solicitudes de empresa antes de enviar la cotización.
 */

/**
 * @param {object} p
 * @param {string} [p.customerName]
 * @param {string} [p.serviceName]
 * @param {string} [p.companyName]
 * @param {string|number} [p.totalPrice]
 * @param {string} [p.currencySymbol]
 * @param {string} [p.requestNotes]
 * @returns {string}
 */
export function buildProfessionalQuoteMessageEsp(p) {
	const customer = p.customerName?.trim() || "cliente";
	const service = p.serviceName?.trim() || "el servicio solicitado";
	const company = p.companyName?.trim() || "nuestro equipo";
	const sym = p.currencySymbol ?? "€";
	const priceStr =
		p.totalPrice !== "" &&
		p.totalPrice !== null &&
		p.totalPrice !== undefined &&
		!Number.isNaN(Number(p.totalPrice))
			? `${sym}${Number(p.totalPrice).toFixed(2)}`
			: `[importe total]`;

	let t = `Estimado/a ${customer},\n\n`;
	t +=
		`Tras analizar los requerimientos recibidos y el alcance de "${service}", nos permitimos enviarle la presentación de nuestra cotización, elaborada de acuerdo con los parámetros indicados y las condiciones habituales de ${company}.\n\n`;
	t += `— Resumen de la propuesta —\n`;
	t += `Importe total: ${priceStr}\n\n`;
	if (p.requestNotes?.trim()) {
		t += `Referencia a su solicitud: ${p.requestNotes.trim()}\n\n`;
	}
	t +=
		"Quedamos a su entera disposición para resolver dudas, ajustar alcances o concretar la formalización de la aceptación cuando lo considere oportuno.\n\n";
	t += `Reciba un cordial saludo,\n${company}`;
	return t;
}

/**
 * Variante de tono (p. ej. segunda pasada o fallback “estilo IA”).
 * @param {object} p — mismos campos que {@link buildProfessionalQuoteMessageEsp}
 * @returns {string}
 */
export function buildAlternateProfessionalQuoteMessageEsp(p) {
	const customer = p.customerName?.trim() || "cliente";
	const service = p.serviceName?.trim() || "su solicitud de servicio";
	const company = p.companyName?.trim() || "nuestro equipo";
	const sym = p.currencySymbol ?? "€";
	const priceStr =
		p.totalPrice !== "" &&
		p.totalPrice !== null &&
		p.totalPrice !== undefined &&
		!Number.isNaN(Number(p.totalPrice))
			? `${sym}${Number(p.totalPrice).toFixed(2)}`
			: `[importe total]`;

	let t = `Buenos días, ${customer}:\n\n`;
	t +=
		`En línea con lo conversado y con los requerimientos registrados, le hacemos llegar de forma cordial la cotización correspondiente a "${service}". La propuesta respeta los parámetros compartidos y refleja el valor acordado para la prestación.\n\n`;
	t += `Propuesta económica: ${priceStr}\n\n`;
	if (p.requestNotes?.trim()) {
		t += `Contexto de la petición: ${p.requestNotes.trim()}\n\n`;
	}
	t +=
		"Agradeceríamos su feedback; cualquier matización será bienvenida antes de cerrar el encargo.\n\n";
	t += `Atentamente,\n${company}`;
	return t;
}
