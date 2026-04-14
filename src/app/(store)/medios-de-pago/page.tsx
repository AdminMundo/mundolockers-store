import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Medios de Pago",
  description:
    "Conoce los medios de pago aceptados en LockerStore: transferencia bancaria, depósito, cheque y efectivo.",
  robots: { index: true, follow: true },
};

export default function MediosDePagoPage() {
  return (
    <PolicyPage
      badge="Pagos"
      title="Medios de Pago"
      subtitle="Opciones de pago disponibles, datos bancarios y cómo enviar tu comprobante."
      updatedAt="Enero 2025"
      sections={[
        {
          title: "Transferencia bancaria (recomendado)",
          content: (
            <>
              <p>
                Es el medio de pago más rápido y seguro. Una vez confirmado tu pedido, realiza
                la transferencia a los siguientes datos:
              </p>
              <ul>
                <li>
                  <strong>Titular:</strong> Mundo Lockers SpA
                </li>
                <li>
                  <strong>RUT:</strong> 76.580.205-9
                </li>
                <li>
                  <strong>Banco:</strong> Scotiabank
                </li>
                <li>
                  <strong>Tipo de cuenta:</strong> Cuenta Corriente
                </li>
                <li>
                  <strong>N° de cuenta:</strong> 980707059
                </li>
                <li>
                  <strong>Email para comprobante:</strong>{" "}
                  <a href="mailto:lockerstore2@gmail.com">lockerstore2@gmail.com</a>
                </li>
              </ul>
              <p className="mt-2">
                Una vez realizada la transferencia, envíanos el comprobante por correo o{" "}
                <a
                  href="https://wa.me/56994131814"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>{" "}
                para agilizar la verificación.
              </p>
            </>
          ),
        },
        {
          title: "Depósito bancario",
          content: (
            <p>
              Puedes realizar un depósito en efectivo en cualquier sucursal de{" "}
              <strong>Scotiabank</strong> a la misma cuenta corriente indicada arriba. Recuerda
              enviarnos el comprobante de depósito con tu nombre y número de pedido para
              identificar el pago correctamente.
            </p>
          ),
        },
        {
          title: "Cheque al día",
          content: (
            <p>
              Aceptamos cheques al día emitidos a nombre de <strong>Mundo Lockers SpA</strong>{" "}
              (RUT 76.580.205-9), sujeto a acuerdo previo. El despacho se realiza una vez
              verificado el cheque. Este medio aplica principalmente para pedidos de empresa o
              proyectos de mayor volumen.
            </p>
          ),
        },
        {
          title: "Efectivo en bodega",
          content: (
            <p>
              Si retiras en nuestra bodega (<strong>Comandante Chacón #5720, Quinta Normal</strong>
              ), puedes pagar en efectivo o con transferencia en el momento. Horario:{" "}
              <strong>lunes a viernes 9:00 – 17:00 hrs</strong>, con cita previa al{" "}
              <a href="tel:+56224354519">+56 2 243 54 519</a>.
            </p>
          ),
        },
        {
          title: "Proceso de verificación del pago",
          content: (
            <ul>
              <li>
                Una vez recibido tu comprobante, verificamos el pago en un plazo de{" "}
                <strong>1 a 2 días hábiles</strong>.
              </li>
              <li>
                Recibirás un correo de confirmación cuando el pago sea validado y el pedido
                entre a producción o despacho.
              </li>
              <li>
                Si no enviamos comprobante dentro de <strong>48 horas hábiles</strong>, el
                pedido puede ser cancelado automáticamente.
              </li>
            </ul>
          ),
        },
        {
          title: "Boletas y facturas",
          content: (
            <>
              <p>
                Emitimos documentos tributarios electrónicos a través del SII:
              </p>
              <ul>
                <li>
                  <strong>Boleta electrónica:</strong> para personas naturales (consumidor final).
                  Se emite automáticamente con el RUT indicado en el pedido.
                </li>
                <li>
                  <strong>Factura electrónica:</strong> para empresas. Indícanos el RUT de
                  empresa, razón social, giro y dirección de facturación al momento de cotizar.
                </li>
              </ul>
              <p className="mt-2">
                El documento tributario se enviará al correo registrado en el pedido dentro de{" "}
                <strong>24 horas hábiles</strong> de confirmado el pago.
              </p>
            </>
          ),
        },
        {
          title: "Seguridad",
          content: (
            <p>
              Todos los pagos se realizan directamente a la cuenta bancaria de Mundo Lockers SpA.
              Nunca solicitamos datos de tarjetas de crédito ni claves bancarias. Si recibes una
              comunicación sospechosa solicitando datos bancarios en nombre de LockerStore, no
              respondas y repórtalo a{" "}
              <a href="mailto:lockerstore2@gmail.com">lockerstore2@gmail.com</a>.
            </p>
          ),
        },
        {
          title: "¿Tienes dudas con tu pago?",
          content: (
            <p>
              Escríbenos a{" "}
              <a href="mailto:lockerstore2@gmail.com">lockerstore2@gmail.com</a> o contacta a
              nuestro equipo por{" "}
              <a
                href="https://wa.me/56994131814"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp +56 9 9413 1814
              </a>{" "}
              indicando tu nombre y número de pedido. Te responderemos a la brevedad.
            </p>
          ),
        },
      ]}
    />
  );
}
