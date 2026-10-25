import { useEffect } from "react";

const PrivacyPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const terms = [
        {
            title: "Introducción", 
            content: [
                "Este Aviso de Privacidad describe cómo POSTDOG (en lo sucesivo “POSTDOG”, “nosotros” o “nuestra plataforma”) recolecta, utiliza, almacena y protege los datos personales de los usuarios que acceden y utilizan los servicios de la plataforma ubicada en https://mypostdog.com.",
                "Al hacer uso del sitio web y sus funcionalidades, el usuario acepta el presente Aviso de Privacidad conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de México."
            ],
        },
        {
            title: "1. Responsable de los datos personales",
            content: [
                "POSTDOG es una plataforma operada desde Reynosa, Tamaulipas, México. Para cualquier duda o aclaración relacionada con la privacidad de sus datos, puede contactarnos al correo electrónico: <a class='text-primary' href='mailto:soporte@postdog.com'>soporte@postdog.com</a> o a través de nuestras redes sociales oficiales (@Postdog_).",
            ],
        },
        {
            title: "2. Datos personales recabados",
            content: [
                "POSTDOG recolecta los siguientes datos personales al momento del registro o uso de los servicios:",
                "- Nombre completo",
                "- Correo electrónico",
                "- Número telefónico",
                "- RFC y régimen fiscal (para facturación)",
                "- Direcciones de origen y destino (para generación de guías y recolección)",
                "- Información sobre el uso del sitio (mediante cookies y herramientas de análisis)",
                "Los datos de pago no son almacenados por POSTDOG. Las operaciones con tarjeta son procesadas directamente a través de la pasarela de pagos externa (PayPal)."
            ],
        },
        {
            title: "3. Finalidades del tratamiento de los datos",
            content: [
                "Los datos personales que el usuario proporcione a POSTDOG serán utilizados para las siguientes finalidades:",
                "- Crear y gestionar la cuenta del usuario en la plataforma",
                "- Procesar pagos y recargas de saldo",
                "- Emitir facturas fiscales cuando se requiera",
                "- Generar guías de envío y coordinar recolecciones",
                "- Contactar al usuario para notificaciones o soporte técnico",
                "- Cumplir con obligaciones legales",
                "- Analizar comportamiento del usuario para mejorar la experiencia (mediante herramientas como Google Analytics y Meta Ads)"
            ],
        },
        {
            title: "4. Uso de cookies y herramientas de análisis",
            content: [
                "POSTDOG utiliza cookies propias y de terceros (Google Analytics, Meta Ads) para recopilar datos sobre el comportamiento de navegación con fines estadísticos, de marketing y optimización de la plataforma.",
                "El usuario puede desactivar las cookies desde la configuración de su navegador, aunque esto podría afectar el funcionamiento del sitio.",
            ],
        },
        {
            title: "5. Transferencia de datos a terceros",
            content: [
                "POSTDOG solo compartirá los datos personales del usuario con las empresas de mensajería (DHL, FedEx, Estafeta, J&T Express) estrictamente para la creación de envíos, generación de etiquetas, seguimiento y posibles devoluciones.",
                "POSTDOG no comercializa, alquila ni cede los datos personales a terceros ajenos al proceso logístico.",
            ],
        },
        {
            title: "6. Medidas de seguridad",
            content: [
                "POSTDOG utiliza un entorno seguro en servidores de Hostinger, y cuenta con un sistema propio de desarrollo para proteger los datos contra acceso no autorizado, pérdida, alteración o divulgación.",
                "El acceso a la información está limitado exclusivamente a los responsables de la plataforma.",
            ],
        },
        {
            title: "7. Conservación de los datos",
            content: [
                "Los datos personales serán conservados de manera indefinida mientras el usuario mantenga activa su cuenta en POSTDOG.",
                "En caso de eliminación voluntaria de la cuenta, los datos serán resguardados durante el tiempo necesario para cumplir obligaciones legales o fiscales, y posteriormente eliminados de forma segura.",
            ],
        },
        {
            title: "8. Cambios al aviso de privacidad",
            content: [
                "POSTDOG podrá modificar este Aviso de Privacidad en cualquier momento, informando al usuario mediante el sitio web o por correo electrónico registrado. Se recomienda revisar periódicamente esta sección para estar al tanto de los cambios.",
            ],
        },
        {
            title: "9. Aceptación del aviso de privacidad",
            content: [
                "El uso continuo de la plataforma implica la aceptación expresa del presente Aviso de Privacidad por parte del usuario.",
            ],
        },
    ];

    return (
        <div className="termsPage">
            <div className="termsPage__date text-end">
                Última actualización: 15 de Junio 2025
            </div>
            <div className="termsPage__container ">
                <h1 className="termsPage__title">
                   Aviso de Privacidad de <span className="termsPage__title-slogan">Postdog</span>
                </h1>
                <div className="termsPage__text">
                    Este Aviso de Privacidad describe cómo POSTDOG (en lo sucesivo “POSTDOG”, “nosotros” o “nuestra plataforma”)
                    recolecta, utiliza, almacena y protege los datos personales de los usuarios que acceden y utilizan los
                    servicios de la plataforma ubicada en <a className="text-primary" href="https://mypostdog.com">https://mypostdog.com</a>.
                </div>
                <div className="termsPage__text">
                    Al hacer uso del sitio web y sus funcionalidades, el usuario acepta el presente Aviso de Privacidad conforme a la
                    Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de México.
                </div>
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
}

export default PrivacyPage;