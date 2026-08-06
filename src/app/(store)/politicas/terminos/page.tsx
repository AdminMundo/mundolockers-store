import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Lee los términos y condiciones de uso del sitio web y de compra en LockerStore.",
  robots: { index: true, follow: true },
};

export default function TerminosPage() {
  return (
    <PolicyPage
      badge="Legal"
      title="Términos y Condiciones"
      subtitle="Condiciones que regulan el uso del sitio web y la relación comercial entre LockerStore y sus clientes."
      updatedAt="Enero 2025"
      sections={[
        {
          title: "Identificación del vendedor",
          content: (
            <p>
              El sitio web <a href="https://www.lockersstore.cl">lockersstore.cl</a> es operado por{" "}
              <strong>Roco Import SpA</strong>, RUT 78.124.096-6, domiciliada en Comandante
              Chacón #5720, Quinta Normal, Santiago, Chile. Contacto:{" "}
              <a href="mailto:lockerstore2@gmail.com">lockerstore2@gmail.com</a> /{" "}
              <a href="tel:+56224354519">+56 2 243 54 519</a>.
            </p>
          ),
        },
        {
          title: "Aceptación de los términos",
          content: (
            <p>
              Al navegar, cotizar o realizar una compra en lockersstore.cl aceptas estos términos en
              su totalidad. Si no estás de acuerdo con alguna parte, te pedimos que no utilices el
              sitio. Nos reservamos el derecho de modificarlos en cualquier momento; la versión
              actualizada prevalecerá desde su publicación.
            </p>
          ),
        },
        {
          title: "Proceso de compra",
          content: (
            <>
              <p>El proceso de compra consta de los siguientes pasos:</p>
              <ul>
                <li>Selección del producto y variante (color, número de puertas, etc.).</li>
                <li>Ingreso de datos de contacto y dirección de despacho.</li>
                <li>
                  Confirmación del pedido y pago mediante transferencia bancaria, depósito u otro
                  medio habilitado.
                </li>
                <li>
                  Recepción de confirmación por correo electrónico con los datos bancarios y el
                  número de pedido.
                </li>
                <li>
                  Verificación del pago por nuestro equipo (plazo: 1–2 días hábiles) y despacho.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "Precios y disponibilidad",
          content: (
            <p>
              Los precios se expresan en <strong>pesos chilenos (CLP)</strong> e incluyen IVA salvo
              indicación contraria. Nos reservamos el derecho de modificar precios sin previo aviso;
              el precio válido es el vigente al momento de confirmar el pedido. La disponibilidad
              de stock se informa en la página de cada producto y puede variar sin previo aviso.
              En caso de quiebre de stock después de realizado el pago, contactaremos al cliente
              para ofrecer un producto equivalente o la devolución íntegra del monto.
            </p>
          ),
        },
        {
          title: "Pago",
          content: (
            <>
              <p>Aceptamos los siguientes medios de pago:</p>
              <ul>
                <li>Transferencia bancaria / depósito (Banco Santander CTA CTE 000097545618).</li>
                <li>Cheque al día (según acuerdo previo).</li>
                <li>Efectivo en bodega (con cita previa).</li>
              </ul>
              <p className="mt-2">
                El pedido se procesa una vez <strong>verificado el pago</strong>. En caso de no
                recibir comprobante dentro de 48 horas hábiles, el pedido podrá ser cancelado.
              </p>
            </>
          ),
        },
        {
          title: "Despacho y tiempos de entrega",
          content: (
            <p>
              Los plazos de entrega son aproximados y dependen de la región de destino, la
              disponibilidad del transportista y eventuales feriados. Roco Import SpA no se
              hace responsable de retrasos imputables a la empresa de transporte. Para más
              detalles, revisa nuestra{" "}
              <a href="/despacho">página de Despacho e Instalación</a>.
            </p>
          ),
        },
        {
          title: "Garantía y devoluciones",
          content: (
            <p>
              Todos nuestros productos cuentan con garantía mínima de <strong>3 meses</strong>{" "}
              contra defectos de fabricación. Las devoluciones por arrepentimiento se rigen por la
              Ley N° 19.496 (Ley del Consumidor): el consumidor tiene{" "}
              <strong>10 días hábiles</strong> desde la recepción para ejercer el derecho a
              retracto. Consulta los detalles en nuestra{" "}
              <a href="/politicas/cambios-y-devoluciones">Política de Cambios y Devoluciones</a> y
              en la <a href="/garantia">página de Garantía</a>.
            </p>
          ),
        },
        {
          title: "Propiedad intelectual",
          content: (
            <p>
              Todo el contenido del sitio web (textos, imágenes, logotipos, diseño, código fuente)
              es propiedad de Roco Import SpA o de sus licenciantes y está protegido por las
              leyes de propiedad intelectual vigentes en Chile. Queda prohibida su reproducción
              total o parcial sin autorización escrita previa.
            </p>
          ),
        },
        {
          title: "Limitación de responsabilidad",
          content: (
            <p>
              Roco Import SpA no será responsable de daños indirectos, lucro cesante ni
              perjuicios derivados del uso inadecuado de los productos o de circunstancias ajenas
              a nuestra voluntad (caso fortuito, fuerza mayor, fallas de terceros). Nuestra
              responsabilidad máxima se limita al valor del producto adquirido.
            </p>
          ),
        },
        {
          title: "Legislación aplicable",
          content: (
            <p>
              Estos términos se rigen por las leyes de la <strong>República de Chile</strong>,
              incluyendo la Ley N° 19.496 (Ley del Consumidor), la Ley N° 19.628 (Protección de
              la Vida Privada) y el Código de Comercio. Cualquier controversia se someterá a los
              tribunales competentes de Santiago.
            </p>
          ),
        },
      ]}
    />
  );
}
