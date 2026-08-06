import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Cambios y Devoluciones",
  description:
    "Conoce la política de cambios y devoluciones de LockerStore: plazos, condiciones y procedimiento según la Ley del Consumidor.",
  robots: { index: true, follow: true },
};

export default function CambiosYDevolucionesPage() {
  return (
    <PolicyPage
      badge="Legal"
      title="Cambios y Devoluciones"
      subtitle="Tu satisfacción es nuestra prioridad. Conoce los plazos y procedimientos para cambios, devoluciones y derecho a retracto."
      updatedAt="Enero 2025"
      sections={[
        {
          title: "Derecho a retracto (Ley 19.496)",
          content: (
            <p>
              Conforme al <strong>artículo 3 bis de la Ley N° 19.496</strong> (Ley del
              Consumidor), tienes derecho a retractarte de una compra realizada por canales no
              presenciales (internet, teléfono) dentro de los{" "}
              <strong>10 días hábiles</strong> siguientes a la recepción del producto, sin
              necesidad de justificar el motivo, siempre que el producto se encuentre en su
              estado original, sin uso y con su embalaje completo.
            </p>
          ),
        },
        {
          title: "Condiciones para ejercer el retracto",
          content: (
            <ul>
              <li>El producto debe estar sin uso, en perfectas condiciones.</li>
              <li>Debe conservar su embalaje, accesorios y documentación original.</li>
              <li>El plazo de 10 días hábiles se cuenta desde la fecha de recepción.</li>
              <li>
                El costo de transporte de devolución corre por cuenta del cliente, salvo que el
                motivo sea un defecto o error nuestro.
              </li>
              <li>
                Productos fabricados a medida o bajo pedido especial quedan excluidos del derecho
                a retracto, según lo dispuesto en el art. 3 bis letra b) de la ley.
              </li>
            </ul>
          ),
        },
        {
          title: "Cómo iniciar un cambio o devolución",
          content: (
            <>
              <p>Sigue estos pasos:</p>
              <ul>
                <li>
                  Escríbenos a{" "}
                  <a href="mailto:lockerstore2@gmail.com">lockerstore2@gmail.com</a> o vía{" "}
                  <a
                    href="https://wa.me/56994131814"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp +56 9 9413 1814
                  </a>{" "}
                  indicando tu número de pedido, motivo y fotos del producto.
                </li>
                <li>
                  Nuestro equipo revisará tu solicitud y te responderá en un plazo máximo de{" "}
                  <strong>2 días hábiles</strong>.
                </li>
                <li>
                  Si procede, coordinamos la recolección del producto o te indicamos la dirección
                  de despacho para la devolución.
                </li>
                <li>
                  Una vez recibido e inspeccionado el producto, procesamos el cambio o la
                  devolución del dinero.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "Plazos de reembolso",
          content: (
            <p>
              Una vez aprobada la devolución y recibido el producto en nuestras instalaciones,
              realizaremos el reembolso dentro de los <strong>5 días hábiles</strong> siguientes,
              mediante transferencia bancaria al titular del pedido. El monto reembolsado
              corresponderá al precio del producto; los costos de envío originales no son
              reembolsables, salvo que la devolución sea por defecto o error nuestro.
            </p>
          ),
        },
        {
          title: "Productos defectuosos o dañados en el envío",
          content: (
            <p>
              Si recibes un producto con defecto de fabricación o dañado durante el transporte,
              debes notificarnos dentro de las <strong>48 horas</strong> de recepción, adjuntando
              fotografías del embalaje y el producto. En estos casos, Roco Import SpA asume{" "}
              <strong>todos los costos</strong> de retiro y reposición o devolución del dinero,
              según lo que prefieras.
            </p>
          ),
        },
        {
          title: "Garantía legal y posventa",
          content: (
            <p>
              Todos nuestros productos cuentan con garantía mínima de{" "}
              <strong>3 meses</strong> contra defectos de fabricación. Si el defecto se manifiesta
              dentro de ese período, tienes derecho a la reparación gratuita, el cambio del
              producto o la devolución del precio pagado, a tu elección. Para más información,
              visita nuestra <a href="/garantia">página de Garantía</a>.
            </p>
          ),
        },
        {
          title: "Excepciones",
          content: (
            <ul>
              <li>
                <strong>Productos a medida o personalizados</strong> (cortes especiales, pintura
                bajo pedido): sin derecho a retracto por arrepentimiento.
              </li>
              <li>
                <strong>Productos con señales de uso</strong>, golpes, rayones o embalaje
                dañado por el cliente: se evaluará caso a caso.
              </li>
              <li>
                <strong>Deterioro normal por uso</strong>: no cubre garantía.
              </li>
            </ul>
          ),
        },
      ]}
    />
  );
}
