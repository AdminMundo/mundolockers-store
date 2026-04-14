import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Garantía",
  description:
    "Conoce la garantía de los productos LockerStore: cobertura, plazos y cómo hacer efectiva tu garantía.",
  robots: { index: true, follow: true },
};

export default function GarantiaPage() {
  return (
    <PolicyPage
      badge="Posventa"
      title="Garantía de Productos"
      subtitle="Respaldamos la calidad de cada locker que fabricamos. Conoce tu cobertura y cómo hacerla efectiva."
      updatedAt="Enero 2025"
      sections={[
        {
          title: "Plazo de garantía",
          content: (
            <p>
              Todos los productos comercializados por <strong>Mundo Lockers SpA</strong> cuentan
              con una garantía mínima de <strong>3 meses</strong> contra defectos de fabricación,
              conforme a lo establecido en la Ley N° 19.496 (Ley del Consumidor). Algunos
              productos pueden contar con garantías extendidas según se indique en su ficha
              técnica.
            </p>
          ),
        },
        {
          title: "¿Qué cubre la garantía?",
          content: (
            <ul>
              <li>Defectos en soldaduras, bisagras y mecanismos de cierre.</li>
              <li>Fallas en cerraduras y sistemas de llave desde la fabricación.</li>
              <li>Deformaciones o roturas del cuerpo metálico o plástico por defecto de material.</li>
              <li>Pintura con desprendimientos prematuros no atribuibles al uso.</li>
              <li>Piezas faltantes o incorrectas respecto a la especificación del pedido.</li>
            </ul>
          ),
        },
        {
          title: "¿Qué NO cubre la garantía?",
          content: (
            <ul>
              <li>Daños por uso inadecuado, sobrecarga o mal manejo.</li>
              <li>Golpes, rayones o abolladuras provocados después de la recepción.</li>
              <li>Oxidación por instalación en ambientes de alta humedad sin ventilación.</li>
              <li>Modificaciones o reparaciones realizadas por terceros no autorizados.</li>
              <li>Desgaste natural propio del uso normal del producto.</li>
              <li>Daños provocados por vandalismo o fuerza mayor.</li>
            </ul>
          ),
        },
        {
          title: "Cómo hacer efectiva la garantía",
          content: (
            <>
              <p>Para solicitar garantía, sigue estos pasos:</p>
              <ul>
                <li>
                  Contáctanos a{" "}
                  <a href="mailto:lockerstore2@gmail.com">lockerstore2@gmail.com</a> o por{" "}
                  <a
                    href="https://wa.me/56994131814"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp +56 9 9413 1814
                  </a>
                  .
                </li>
                <li>
                  Indica tu <strong>número de pedido</strong> y describe el defecto con fotografías
                  o video del problema.
                </li>
                <li>
                  Nuestro equipo técnico evaluará el caso y te responderá en{" "}
                  <strong>2 días hábiles</strong>.
                </li>
                <li>
                  Si la garantía procede, coordinaremos el retiro, reparación o reposición{" "}
                  <strong>sin costo para el cliente</strong>.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "Opciones de solución",
          content: (
            <>
              <p>
                Según lo dispuesto en el <strong>artículo 20 de la Ley 19.496</strong>, en caso de
                defecto confirmado dentro del plazo de garantía, podrás optar por:
              </p>
              <ul>
                <li>
                  <strong>Reparación gratuita</strong> del producto defectuoso.
                </li>
                <li>
                  <strong>Cambio</strong> por un producto equivalente en perfecto estado.
                </li>
                <li>
                  <strong>Devolución del precio pagado</strong> íntegramente.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "Plazos de respuesta",
          content: (
            <p>
              Una vez recibido el producto en garantía en nuestras instalaciones, el plazo máximo
              para resolver el caso es de <strong>30 días corridos</strong>. Si se supera dicho
              plazo, tienes derecho automático a exigir la devolución del precio pagado.
            </p>
          ),
        },
        {
          title: "Garantía de instalación",
          content: (
            <p>
              El servicio de instalación realizado por nuestro equipo tiene una garantía de{" "}
              <strong>30 días</strong> sobre la correcta fijación y nivelación de los muebles. No
              cubre daños a la estructura del inmueble o cambios en las condiciones del lugar
              posteriores a la instalación.
            </p>
          ),
        },
      ]}
    />
  );
}
