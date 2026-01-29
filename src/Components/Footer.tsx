export function Footer() {
  return (
    // Fixed footer stays visible while scrolling survey content.
    <footer className="pt-10 bottom-0 left-0 right-0 z-40 bg-transparent">
      <div className="container mx-auto max-w-6xl px-6 py-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Placeholder for future footer navigation or branding. */}
        </div>

        {/* Footer divider stays within the content width instead of full-bleed. */}
        <div className="border-t border-gray-300/70 mt-4 pt-4 text-center">
          <p className="text-primary-foreground/60 text-sm">
           {/* © 2026 <span className="text-[#00afef]">InicioNG</span> Tech Team. */}
           © 2026 InicioNG Tech Team.<br />
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
