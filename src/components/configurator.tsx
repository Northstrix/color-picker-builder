
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import ColorPicker, {
  type ColorPickerProps,
} from "@/components/ColorPicker";
import { presets } from "@/app/presets";
import {
  useSidebar,
} from "@/components/ui/sidebar";
import ControlsSidebar from "@/components/controls-sidebar";
import CodePreview from "@/components/code-preview";
import { Button } from "@/components/ui/button";
import { PanelLeft, PanelRight } from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarFooter } from "@/components/ui/sidebar";


export default function Configurator() {
  const [props, setProps] = useState<ColorPickerProps>(presets.default.props);
  const [color, setColor] = useState(presets.default.props.value || "#06B5EF");
  const [maxWidth, setMaxWidth] = useState(364);
  const { toggleSidebar, open } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSetPreset = (presetName: string) => {
    const preset =
      presets[presetName as keyof typeof presets] || presets.default;
    setProps(preset.props);
    if (preset.props.value) {
      setColor(preset.props.value);
    }
  };

  const handlePropsChange = (newProps: Partial<ColorPickerProps>) => {
    setProps((prev) => ({ ...prev, ...newProps }));
  };

  useEffect(() => {
    if(props.value) {
      setColor(props.value);
    }
  }, [props.value])
  
  const onColorChange = useCallback((newColor: string) => {
    setColor(newColor);
    setProps((p) => ({ ...p, value: newColor }));
  }, []);

  const memoizedColorPicker = useMemo(() => {
    if (!isMounted) return null;
    return <ColorPicker {...props} value={color} onValueChange={onColorChange} />;
  }, [props, color, isMounted, onColorChange]);

  return (
    <>
      <Sidebar>
        <ControlsSidebar
          props={props}
          setProps={handlePropsChange}
          onSetPreset={handleSetPreset}
          maxWidth={maxWidth}
          setMaxWidth={setMaxWidth}
        />
      </Sidebar>
      <SidebarInset>
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-headline font-medium">Live Preview</h2>
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
                {open ? <PanelLeft /> : <PanelRight />}
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </div>
            <div className="flex items-center justify-center p-8 bg-card rounded-lg border shadow-sm">
              <div style={{ maxWidth: `${maxWidth}px`, width: '100%' }}>
                {memoizedColorPicker}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <h2 className="text-lg font-headline font-medium">Export</h2>
            <CodePreview props={{...props, value: color}} maxWidth={maxWidth}/>
          </div>
        </main>
      </SidebarInset>
    </>
  );
}
