import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Despacho e Instalación",
  description:
    "Información sobre tiempos de entrega, zonas de despacho, retiro en bodega e instalación de lockers en Chile.",
  robots: { index: true, follow: true },
};

export default function DespachoPage() {
  return (
    <PolicyPage
      badge="Logística"
      title="Despacho e Instalación"
      subtitle="Entregamos en todo Chile. Conoce los plazos, costos y opciones de instalación disponibles."
      updatedAt="Enero 2025"
      sections={[
        {
          title: "Cobertura de despacho",
          content: (
            <p>
              Despachamos a <strong>todo Chile continental</strong>, desde Arica hasta Punta
              Arenas. Los envíos a regiones extremas (Aysén, Magallanes, Atacama norte) pueden
              tener plazos adicionales. Para proyectos en zonas de difícil acceso o islas,
              consúltanos previamente.
            </p>
          ),
        },
        {
          title: "Plazos de entrega estimados",
          content: (
            <>
              <p>
                Los plazos se cuentan desde la <strong>verificación del pago</strong>:
              </p>
              <ul>
                <li>
                  <strong>Región Metropolitana:</strong> 3 a 5 días hábiles.
                </li>
                <li>
                  <strong>Regiones V, VI, VII (cercanas a RM):</strong> 5 a 7 días hábiles.
                </li>
                <li>
                  <strong>Resto de regiones:</strong> 7 a 12 días hábiles.
                </li>
                <li>
                  <strong>Zonas extremas (Aysén, Magallanes):</strong> 12 a 18 días hábiles.
                </li>
              </ul>
              <p className="mt-2">
                Estos plazos son estimados y pueden verse afectados por alta demanda, feriados o
                situaciones de fuerza mayor.
              </p>
            </>
          ),
        },
        {
          title: "Costo de despacho",
          content: (
            <p>
              El costo de despacho se calcula según el volumen, peso y destino del pedido. Se
              informa al momento de confirmar la cotización. Para pedidos de gran volumen
              (proyectos institucionales, licitaciones), ofrecemos{" "}
              <strong>despacho a costo especial o incluido</strong> según acuerdo. Consúltanos
              por{" "}
              <a
                href="https://wa.me/56933882434"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>{" "}
              o correo para grandes pedidos.
            </p>
          ),
        },
        {
          title: "Retiro en bodega",
          content: (
            <p>
              También puedes retirar tu pedido directamente en nuestra bodega ubicada en{" "}
              <strong>Comandante Chacón #5720, Quinta Normal, Santiago</strong>, sin costo de
              despacho. El retiro debe coordinarse previamente llamando al{" "}
              <a href="tel:+56224354519">+56 2 243 54 519</a> o escribiéndonos. Horario de
              atención: <strong>lunes a viernes de 9:00 a 17:00 hrs</strong>.
            </p>
          ),
        },
        {
          title: "Empresas de transporte",
          content: (
            <>
              <p>
                Trabajamos con empresas de transporte de carga especializadas en artículos de
                gran volumen:
              </p>
              <ul>
                <li>Starken</li>
                <li>Chilexpress Carga</li>
                <li>Transportes propios (Región Metropolitana)</li>
              </ul>
              <p className="mt-2">
                Una vez despachado el pedido, te enviaremos el número de seguimiento para que
                puedas rastrear tu envío.
              </p>
            </>
          ),
        },
        {
          title: "Recepción del pedido",
          content: (
            <ul>
              <li>
                Al recibir el pedido, <strong>revisa el embalaje</strong> antes de firmar la
                recepción. Si hay daños visibles en la caja, indícalo en el comprobante del
                transportista.
              </li>
              <li>
                Informa cualquier daño dentro de las <strong>48 horas</strong> de recepción,
                adjuntando fotografías, para gestionar la garantía.
              </li>
              <li>
                Para despachos en piso, el transportista dejará el producto en el acceso al
                edificio o domicilio. El traslado interno es responsabilidad del cliente salvo
                contratación de instalación.
              </li>
            </ul>
          ),
        },
        {
          title: "Servicio de instalación",
          content: (
            <>
              <p>
                Ofrecemos servicio de instalación para la{" "}
                <strong>Región Metropolitana y zonas cercanas</strong>. El servicio incluye:
              </p>
              <ul>
                <li>Traslado interno hasta el lugar de instalación.</li>
                <li>Ensamblaje y nivelación de los lockers.</li>
                <li>Fijación a pared o piso según requerimiento (taco y perno).</li>
                <li>Entrega de llaves y revisión de funcionamiento.</li>
              </ul>
              <p className="mt-2">
                Para cotizar instalación, indícalo al momento de cotizar o escríbenos. El costo
                varía según la cantidad de módulos y la ubicación.
              </p>
            </>
          ),
        },
        {
          title: "Proyectos y licitaciones",
          content: (
            <p>
              Para proyectos institucionales, colegios, industrias y licitaciones públicas,
              ofrecemos condiciones especiales de despacho, instalación y facturación. Contáctanos
              a{" "}
              <a href="mailto:lockerstore2@gmail.com">lockerstore2@gmail.com</a> o al{" "}
              <a href="tel:+56224354519">+56 2 243 54 519</a> para coordinar una visita técnica
              sin costo.
            </p>
          ),
        },
      ]}
    />
  );
}
