const WHATSAPP_NUMBER = "56994131814";
const WHATSAPP_TEXT = encodeURIComponent("Hola! Quiero cotizar lockers.");

export default function WhatsAppFloatingButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Cotizar por WhatsApp"
      className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#0477BF] text-white shadow-[0_4px_18px_rgba(4,119,191,0.45)] transition-all duration-200 hover:scale-105 hover:brightness-110 lg:bottom-6 lg:right-6"
    >
      <svg viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7" aria-hidden="true">
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.7 4.605 1.907 6.47L4 29l7.72-1.86A11.93 11.93 0 0 0 16.001 27C22.63 27 28 21.627 28 15S22.63 3 16.001 3Zm0 21.818a9.77 9.77 0 0 1-4.98-1.362l-.357-.212-4.583 1.104 1.127-4.47-.232-.366A9.78 9.78 0 0 1 5.182 15c0-5.965 4.854-10.818 10.819-10.818S26.818 9.035 26.818 15 21.966 24.818 16.001 24.818Zm5.55-7.29c-.303-.152-1.792-.885-2.07-.986-.278-.101-.48-.152-.682.152-.202.303-.783.986-.96 1.188-.176.202-.353.227-.656.076-.303-.152-1.28-.472-2.437-1.505-.901-.804-1.51-1.797-1.687-2.1-.176-.303-.019-.467.133-.618.137-.136.303-.354.454-.53.152-.177.202-.303.303-.505.101-.202.05-.379-.025-.53-.076-.152-.682-1.646-.935-2.253-.246-.591-.497-.511-.682-.52l-.581-.01c-.202 0-.53.076-.808.379-.278.303-1.06 1.036-1.06 2.527 0 1.49 1.086 2.93 1.237 3.132.151.202 2.137 3.263 5.178 4.575.723.312 1.288.499 1.728.639.726.231 1.387.198 1.909.12.582-.087 1.792-.733 2.045-1.44.253-.708.253-1.314.177-1.44-.076-.126-.278-.202-.581-.354Z" />
      </svg>
    </a>
  );
}
