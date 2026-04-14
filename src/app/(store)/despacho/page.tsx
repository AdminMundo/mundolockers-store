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
          title: "Productos de fabricación nacional",
          content: (
            <p>
              Nuestros lockers son <strong>fabricados en Chile</strong> con acero de alta calidad,
              lo que nos permite controlar cada etapa del proceso productivo y garantizar
              estándares superiores en resistencia, acabado y durabilidad. Al comprar con
              nosotros apoyas la industria local y recibes un producto hecho a medida para las
              condiciones del mercado chileno.
            </p>
          ),
        },
        {
          title: "Tiempos de entrega coordinados",
          content: (
            <>
              <p>
                Cada pedido es <strong>único</strong>. Los tiempos de entrega dependen del
                modelo, la cantidad solicitada y tu ubicación, por lo que no manejamos plazos
                genéricos. Lo que sí garantizamos es que{" "}
                <strong>un ejecutivo te contactará dentro de las 24 horas</strong> siguientes a
                confirmar tu pedido para coordinar contigo la fecha de entrega más conveniente.
              </p>
              <p className="mt-2">
                Si necesitas un plazo específico (apertura de instalaciones, inicio de clases,
                proyectos de obra), <strong>indícalo al cotizar</strong> y haremos todo lo
                posible por cumplirlo.
              </p>
            </>
          ),
        },
        {
          title: "Cobertura de despacho",
          content: (
            <p>
              Despachamos a <strong>todo Chile continental</strong>, desde Arica hasta Punta
              Arenas. Para regiones extremas (Aysén, Magallanes) o zonas de difícil acceso,
              coordinamos el envío con empresas de carga especializada. Consúltanos previamente
              para proyectos fuera de las ciudades principales.
            </p>
          ),
        },
        {
          title: "Costo de despacho",
          content: (
            <p>
              El costo se calcula según el volumen, peso y destino del pedido, y se informa al
              confirmar la cotización. Para pedidos de gran volumen — proyectos institucionales,
              colegios, industrias — ofrecemos{" "}
              <strong>despacho a costo especial o incluido</strong> según acuerdo. Escríbenos por{" "}
              <a href="https://wa.me/56994131814" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>{" "}
              o a{" "}
              <a href="mailto:lockerstore2@gmail.com">lockerstore2@gmail.com</a> para
              coordinar.
            </p>
          ),
        },
        {
          title: "Retiro en bodega",
          content: (
            <p>
              Si prefieres retirar tu pedido personalmente, puedes hacerlo en nuestra bodega en{" "}
              <strong>Quinta Normal, Santiago</strong>, sin costo de despacho. El retiro debe
              coordinarse previamente con nuestro equipo comercial escribiéndonos por WhatsApp o
              correo. Te indicaremos la dirección exacta y el horario disponible al momento de
              coordinar.
            </p>
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
                Informa cualquier daño dentro de las <strong>48 horas</strong> de recepción
                adjuntando fotografías para gestionar la garantía.
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
                Indícalo al cotizar o escríbenos. El costo varía según la cantidad de módulos y
                la ubicación.
              </p>
            </>
          ),
        },
        {
          title: "Proyectos y licitaciones",
          content: (
            <p>
              Para proyectos institucionales, colegios, industrias y licitaciones públicas
              ofrecemos condiciones especiales de despacho, instalación y facturación. Contáctanos
              a{" "}
              <a href="mailto:lockerstore2@gmail.com">lockerstore2@gmail.com</a> o
              por{" "}
              <a href="https://wa.me/56994131814" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>{" "}
              para coordinar una visita técnica sin costo.
            </p>
          ),
        },
      ]}
    />
  );
}
