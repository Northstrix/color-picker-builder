"use client";

import React from 'react';
import NamerUiBadge from "@/components/namer-ui-badge";

export default function Footer() {
    return (
        <footer className='p-4 border-t'>
            <div className='flex justify-center'>
                <NamerUiBadge />
            </div>
                <div
                className="mt-4 pt-4 flex items-center justify-center gap-2 border-t text-center text-sm text-gray-400"
                dir="ltr"
                >
                <a
                    href="https://sourceforge.net/projects/color-picker-builder/"
                    target="_blank"
                    className="text-accent-foreground hover:text-primary hover:underline transition-colors"
                >
                    SourceForge
                </a>
                <a
                    href="https://github.com/Northstrix/color-picker-builder"
                    target="_blank"
                    className="text-accent-foreground hover:text-primary hover:underline transition-colors"
                >
                    GitHub
                </a>
                </div>
                <div className="pt-4 text-center text-sm text-gray-400" dir="ltr">
                    <div className="mb-1">
                        Made by{" "}
                        <a
                        href="https://maxim-bortnikov.netlify.app/"
                        target="_blank"
                        className="text-accent-foreground hover:text-primary hover:underline transition-colors"
                        >
                        Maxim Bortnikov
                        </a>
                    </div>
                    
                    <div className="mb-12">
                        using{" "}
                        <a
                        href="https://nextjs.org"
                        target="_blank"
                        className="text-accent-foreground hover:text-primary hover:underline transition-colors"
                        >
                        Next.js
                        </a>
                        ,{" "}
                        <a
                        href="https://www.perplexity.ai"
                        target="_blank"
                        className="text-accent-foreground hover:text-primary hover:underline transition-colors"
                        >
                        Perplexity
                        </a>
                        ,{" "}and{" "}
                        <a
                        href="https://firebase.studio"
                        target="_blank"
                        className="text-accent-foreground hover:text-primary hover:underline transition-colors"
                        >
                        Firebase Studio
                        </a>.
                    </div>
                </div>
        </footer>
    );
};
