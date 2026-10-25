import "./TermsPage.css";
import { useEffect } from "react";

const terms = [
	{
		title: "1. Definiciones",
		content: [
			"Para efectos de los presentes Términos y Condiciones, se entenderá por:",
			"- “Postdog”: Plataforma digital que actúa como intermediario para la compra, generación y gestión de servicios de envío ofrecidos por empresas de mensajería en México.",
			"- “Usuario”: Cualquier persona física o moral que accede, se registra o utiliza los servicios ofrecidos por Postdog a través de su sitio web.",
			"- “Paquetería” o “Transportista”: Empresa que presta directamente el servicio de recolección, transporte y entrega de paquetes. Ejemplos: FedEx, DHL, Estafeta, J&T Express.",
			"- “Guía”: Etiqueta digital generada a través de Postdog para realizar el envío de un paquete mediante la paquetería seleccionada.",
			"- “Saldo”: Sistema interno de crédito mediante el cual el usuario paga los servicios dentro de la plataforma.",
		],
	},
	{
		title: "2. Objeto de los Términos y Condiciones",
		content: [
			"Establecer los derechos, obligaciones y responsabilidades que rigen entre los usuarios y Postdog por el uso del sitio web, los servicios ofrecidos y la interacción con empresas de paquetería a través de la plataforma.",
		],
	},
	{
		title: "3. Aceptación de los Términos",
		content: [
			"El uso del sitio web de Postdog implica la aceptación expresa de los presentes Términos y Condiciones. Al registrarse, realizar recargas, generar guías o interactuar con la plataforma, el usuario declara haber leído, comprendido y aceptado íntegramente este documento.",
		],
	},
	{
		title: "4. Registro de usuarios",
		content: [
			"Para utilizar los servicios ofrecidos por Postdog, es obligatorio crear una cuenta. El usuario se compromete a proporcionar información verdadera, actualizada y completa. Cualquier uso fraudulento, duplicación de cuentas o falsificación de datos podrá derivar en la suspensión o cancelación de la cuenta.",
		],
	},
	{
		title: "5. Funcionamiento general de Postdog",
		content: [
			"Postdog no es una empresa de mensajería, logística o transporte. Es un intermediario tecnológico que permite al usuario acceder a tarifas preferenciales, generar guías y gestionar envíos directamente con empresas de paquetería.",
		],
	},
	{
		title: "6. Servicios ofrecidos",
		content: [
			"- Generación de guías de envío con diversas empresas de paquetería.",
			"- Integración con plataformas de e-commerce como WooCommerce y Shopify.",
			"- Gestión de recolección a domicilio si la paquetería lo permite.",
			"- Sistema de saldo interno para facilitar pagos.",
		],
	},
	{
		title: "7. Proceso de compra de envíos",
		content: [
			"El usuario elige la paquetería, carga los datos del envío y genera la guía desde su cuenta. Las guías se pagan con el saldo interno y pueden incluir opcionalmente un seguro adicional proporcionado por Postdog.",
		],
	},
	{
		title: "8. Pagos y recargas de saldo",
		content: [
			"El usuario puede recargar saldo mediante tarjeta de débito, crédito o transferencia bancaria. Todos los precios incluyen IVA. Las facturas se generan automáticamente si el usuario registró sus datos fiscales. El saldo solo puede utilizarse para adquirir servicios dentro de la plataforma.",
		],
	},
	{
		title: "9. Cancelaciones, reembolsos y errores en las guías",
		content: [
			"Las guías pueden ser canceladas por el usuario bajo ciertos criterios (error en datos, cambio de decisión, etc.). Al cancelarse, el monto correspondiente será reintegrado al saldo interno de forma automática. No se realizan reembolsos en efectivo.",
		],
	},
	{
		title: "10. Seguro y garantías de envío",
		content: [
			"El usuario puede optar por un seguro adicional ofrecido por Postdog al momento de generar su envío. Este seguro cubre pérdida o daño según condiciones específicas. Cada paquetería también incluye una garantía limitada propia. Postdog no es responsable por los servicios logísticos, ya que el contrato se establece directamente entre el usuario y la empresa de mensajería.",
		],
	},
	{
		title: "11. Limitaciones del servicio",
		content: [
			"Postdog solo está disponible en la República Mexicana. Está prohibido utilizar la plataforma para enviar artículos ilegales, peligrosos o prohibidos por la legislación vigente o por las políticas de las empresas de paquetería.",
		],
	},
	{
		title: "12. Obligaciones del usuario",
		content: [
			"El usuario se obliga a utilizar la plataforma de manera lícita, respetuosa y conforme a estos términos. Debe asegurarse de ingresar correctamente los datos del envío, embalar adecuadamente sus paquetes y cumplir con las regulaciones aplicables.",
		],
	},
	{
		title: "13. Conductas prohibidas",
		content: [
			"Está estrictamente prohibido:",
			"- Usar bots, scrapers o automatizaciones no autorizadas.",
			"- Crear cuentas falsas.",
			"- Modificar, falsificar o reutilizar guías.",
			"- Realizar fraudes, abusar del sistema de reembolsos o reventas no autorizadas.",
			"La infracción de estas reglas podrá derivar en la suspensión o cancelación definitiva de la cuenta.",
		],
	},
	{
		title: "14. Propiedad intelectual",
		content: [
			"El nombre, logotipo, diseño y contenido de Postdog son propiedad de sus fundadores. Aunque no se encuentren formalmente registrados, su uso sin autorización está prohibido y puede generar acciones legales.",
		],
	},
	{
		title: "15. Limitación de responsabilidad",
		content: [
			"Postdog no se hace responsable por retrasos, daños, pérdidas o cualquier incumplimiento atribuible a las empresas de paquetería. Su rol es únicamente facilitar el acceso a dichos servicios.",
		],
	},
	{
		title: "16. Modificaciones a los Términos y Condiciones",
		content: [
			"Postdog se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las versiones actualizadas estarán disponibles en el sitio web y entrarán en vigor desde su publicación.",
		],
	},
	{
		title: "17. Jurisdicción y legislación aplicable",
		content: [
			"Cualquier disputa derivada del uso de la plataforma será resuelta conforme a las leyes vigentes en México, y las partes se someten a la jurisdicción exclusiva de los tribunales de Reynosa, Tamaulipas.",
		],
	},
	{
		title: "18. Contacto",
		content: [
			"Para cualquier duda, aclaración o queja relacionada con estos Términos y Condiciones, el usuario podrá contactar a Postdog a través del correo soporte@postdog.com o mediante nuestras redes sociales oficiales: @Postdog_ en Facebook, Instagram y TikTok.",
		],
	},
	{
		title: "19. Protección de datos personales",
		content: [
			"Postdog se compromete a proteger la información personal de sus usuarios. Los datos recabados al momento del registro o uso del sitio (como nombre, correo electrónico, dirección, datos fiscales, etc.) son utilizados exclusivamente para la correcta prestación de los servicios ofrecidos.",
			"Postdog no venderá, transferirá ni compartirá la información personal de sus usuarios con terceros, salvo con las empresas de paquetería para cumplir con los envíos. El usuario podrá solicitar la modificación o eliminación de sus datos personales escribiendo a soporte@postdog.com.",
		],
	},
	{
		title: "20. Responsabilidad sobre pagos y accesos no autorizados",
		content: [
			"El usuario es responsable de todas las operaciones realizadas dentro de su cuenta. En caso de detectar accesos no autorizados o cargos indebidos, deberá notificarlo de inmediato a Postdog.",
			"Postdog no se hace responsable por el mal uso de la cuenta debido a negligencia del usuario para proteger su contraseña, correo o dispositivos de acceso.",
		],
	},
	{
		title: "21. Disponibilidad y funcionamiento del sitio",
		content: [
			"Postdog busca mantener su sitio web y servicios disponibles 24/7. Sin embargo, podrían presentarse interrupciones por mantenimiento, actualizaciones técnicas o errores fuera de su control.",
			"Postdog no garantiza disponibilidad continua e ininterrumpida del servicio, pero se compromete a resolver cualquier incidente técnico en el menor tiempo posible.",
		],
	},
	{
		title: "22. Facturación",
		content: [
			"Para la emisión de facturas fiscales, es responsabilidad del usuario registrar correctamente sus datos fiscales en su cuenta antes de realizar cualquier recarga o compra de servicios.",
			"No se emitirán facturas retroactivas ni se harán correcciones una vez emitidas. Todas las tarifas mostradas en la plataforma ya incluyen el Impuesto al Valor Agregado (IVA).",
		],
	},
	{
		title: "23. Productos prohibidos",
		content: [
			"Está prohibido utilizar los servicios de Postdog para el envío de los siguientes productos, entre otros:",
			"- Drogas ilegales",
			"- Armas de fuego o explosivos",
			"- Animales vivos o restos humanos",
			"- Dinero en efectivo, metales preciosos, joyas de alto valor",
			"- Sustancias peligrosas o inflamables",
			"El usuario es responsable por cualquier consecuencia derivada del incumplimiento de esta cláusula, incluyendo sanciones de la paquetería, decomisos o acciones legales.",
		],
	},
	{
		title: "24. Comunicación oficial",
		content: [
			"Toda comunicación oficial entre Postdog y el usuario se realizará mediante el correo electrónico atencion@postdog.com o a través de las redes sociales oficiales (@Postdog_).",
			"Postdog no se hace responsable por comunicaciones realizadas por canales no oficiales o terceros que suplanten su identidad.",
		],
	},
	{
		title: "25. Embalaje y preparación de envíos",
		content: [
			"El correcto embalaje de los paquetes es responsabilidad total del usuario. Postdog no es responsable por daños, pérdidas o rechazos causados por embalaje deficiente.",
			"Las paqueterías podrían rechazar paquetes mal empacados o que no cumplan con sus lineamientos. El seguro no cubrirá siniestros ocasionados por esta causa.",
		],
	},
	{
		title: "26. Vigencia y terminación de cuenta",
		content: [
			"Postdog se reserva el derecho de desactivar cuentas inactivas durante más de 12 meses. Asimismo, podrá suspender o eliminar cuentas de usuarios que incurran en uso indebido de la plataforma, a su entera discreción.",
			"En casos de cancelación por incumplimiento grave, el saldo disponible no será reembolsado.",
		],
	},
];

const TermsPage = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="termsPage">
				<div className="termsPage__date text-end">
					Última actualización: 15 de Junio 2025
				</div>
			<div className="termsPage__container  ">
				<h1 className="termsPage__title">
					Términos y Condiciones de Uso de <span className="termsPage__title-slogan">Postdog</span>
				</h1>
				{terms.map((section, idx) => (
					<div key={idx}>
						<div className="termsPage__sectionTitle" dangerouslySetInnerHTML={{ __html: section.title }} />
						{section.content.map((txt, i) =>
							txt.startsWith("-") ? (
								<ul className="termsPage__list" key={i}>
									<li className="termsPage__text" dangerouslySetInnerHTML={{ __html: txt.replace("-", "").trim() }} />
								</ul>
							) : (
								<div className="termsPage__text" key={i} dangerouslySetInnerHTML={{ __html: txt }} />
							)
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default TermsPage;