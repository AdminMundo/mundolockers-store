import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Conoce cómo LockerStore recopila, usa y protege tus datos personales según la Ley 19.628 de Chile.",
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  return (
    <PolicyPage
      badge="Legal"
      title="Política de Privacidad"
      subtitle="Descripción de cómo recopilamos, usamos y protegemos tu información personal."
      updatedAt="Enero 2025"
      sections={[
        {
          title: "Responsable del tratamiento",
          content: (
            <p>
              <strong>Lockers Store SpA</strong>, RUT 78.422.139-3, con domicilio en Covadonga 631,
              Depto. C 201, San Bernardo, Santiago, Chile, es responsable del tratamiento de los
              datos personales recabados a través de{" "}
              <a href="https://www.lockersstore.cl">lockersstore.cl</a>. Para consultas, escríbenos a{" "}
              <a href="mailto:ventas@lockersstore.cl">ventas@lockersstore.cl</a>.
            </p>
          ),
        },
        {
          title: "Datos que recopilamos",
          content: (
            <>
              <p>Recabamos únicamente los datos necesarios para procesar tu pedido o cotización:</p>
              <ul>
                <li>Nombre completo y RUT o pasaporte.</li>
                <li>Dirección de entrega (región, comuna, calle y número).</li>
                <li>Correo electrónico y teléfono de contacto.</li>
                <li>Información del pedido: productos, cantidades y monto.</li>
                <li>Datos de navegación (cookies técnicas, IP, navegador) para mejorar el sitio.</li>
              </ul>
            </>
          ),
        },
        {
          title: "Finalidad del tratamiento",
          content: (
            <ul>
              <li>Gestionar y confirmar pedidos y cotizaciones.</li>
              <li>Coordinar el despacho e instalación de los productos.</li>
              <li>Emitir boletas y facturas según la normativa tributaria chilena.</li>
              <li>Responder consultas y brindar soporte posventa.</li>
              <li>Mejorar la experiencia de navegación en el sitio web.</li>
            </ul>
          ),
        },
        {
          title: "Base legal (Ley 19.628)",
          content: (
            <p>
              El tratamiento se realiza con el <strong>consentimiento del titular</strong> al
              completar un formulario o realizar una compra, y cuando es necesario para la{" "}
              <strong>ejecución del contrato</strong> de compraventa o prestación de servicios
              logísticos. Nos regimos por la Ley N° 19.628 sobre Protección de la Vida Privada.
            </p>
          ),
        },
        {
          title: "Conservación de datos",
          content: (
            <p>
              Conservamos tus datos durante el tiempo necesario para cumplir las finalidades
              descritas y, como mínimo, el plazo exigido por la normativa tributaria chilena{" "}
              <strong>(6 años desde la fecha del documento)</strong>. Transcurrido dicho período,
              los datos serán eliminados o anonimizados de forma segura.
            </p>
          ),
        },
        {
          title: "Compartir información con terceros",
          content: (
            <>
              <p>
                No vendemos ni cedemos tus datos a terceros con fines comerciales. Solo los
                compartimos cuando es estrictamente necesario:
              </p>
              <ul>
                <li>
                  <strong>Empresas de transporte</strong> (Starken, Chilexpress, etc.) para
                  coordinar el despacho.
                </li>
                <li>
                  <strong>Proveedores de servicios tecnológicos</strong> (alojamiento, email) que
                  actúan como encargados del tratamiento bajo acuerdos de confidencialidad.
                </li>
                <li>
                  <strong>Autoridades</strong> cuando la ley nos obligue a hacerlo.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "Tus derechos",
          content: (
            <>
              <p>
                Conforme a la Ley 19.628 tienes derecho a <strong>acceder</strong>,{" "}
                <strong>rectificar</strong>, <strong>cancelar</strong> y{" "}
                <strong>oponerte</strong> al tratamiento de tus datos (derechos ARCO). Para
                ejercerlos:
              </p>
              <ul>
                <li>
                  Envía un correo a{" "}
                  <a href="mailto:ventas@lockersstore.cl">ventas@lockersstore.cl</a> indicando el
                  derecho que deseas ejercer y adjuntando una copia de tu cédula de identidad.
                </li>
                <li>Responderemos en un plazo máximo de 15 días hábiles.</li>
              </ul>
            </>
          ),
        },
        {
          title: "Cookies",
          content: (
            <p>
              Utilizamos cookies técnicas imprescindibles para el funcionamiento del sitio (sesión,
              carrito). No usamos cookies de publicidad de terceros. Puedes configurar tu navegador
              para bloquear o eliminar cookies; ten en cuenta que esto puede afectar algunas
              funcionalidades del sitio.
            </p>
          ),
        },
        {
          title: "Modificaciones a esta política",
          content: (
            <p>
              Podemos actualizar esta política en cualquier momento. La versión vigente siempre
              estará disponible en{" "}
              <a href="/politicas/privacidad">lockersstore.cl/politicas/privacidad</a>. Los cambios
              relevantes se comunicarán por correo electrónico a los clientes registrados.
            </p>
          ),
        },
      ]}
    />
  );
}
