
"use client";

import React, { useCallback, useRef } from "react";
import type { ColorPickerProps } from "@/components/ColorPicker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SidebarHeader, SidebarContent } from "@/components/ui/sidebar";
import { presets } from "@/app/presets";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import Footer from "./footer";
import { useToast } from "@/hooks/use-toast";
import RefinedChronicleButton from "@/components/RefinedChronicleButton";

interface ControlsSidebarProps {
  props: ColorPickerProps;
  setProps: (props: Partial<ColorPickerProps>) => void;
  onSetPreset: (presetName: string) => void;
  maxWidth: number;
  setMaxWidth: (width: number) => void;
}

const PropInput = ({ label, value, onChange, type = "text", ...rest }: any) => (
  <div className="grid grid-cols-2 items-center gap-4">
    <Label htmlFor={label} className="text-xs truncate">
      {label}
    </Label>
    <Input
      id={label}
      type={type}
      value={value === undefined ? '' : value}
      onChange={(e) => onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
      className="h-8 text-xs"
      {...rest}
    />
  </div>
);

const PropSwitch = ({ label, checked, onCheckedChange }: any) => (
  <div className="flex items-center justify-between">
    <Label htmlFor={label} className="text-xs">
      {label}
    </Label>
    <Switch id={label} checked={!!checked} onCheckedChange={onCheckedChange} />
  </div>
);

const PropSelect = ({ label, value, onValueChange, options }: any) => (
    <div className="grid grid-cols-2 items-center gap-4">
      <Label htmlFor={label} className="text-xs truncate">
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option: any) => (
            <SelectItem key={option.value || option} value={option.value || option}>
              {option.label || option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

export default function ControlsSidebar({
  props,
  setProps,
  onSetPreset,
  maxWidth,
  setMaxWidth,
}: ControlsSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleExport = () => {
    const jsonString = JSON.stringify({ props, maxWidth }, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "color-picker-config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result;
          if (typeof text === 'string') {
            const config = JSON.parse(text);
            if (config.props) {
              setProps(config.props);
            }
            if (typeof config.maxWidth === 'number') {
              setMaxWidth(config.maxWidth);
            }
            toast({
              title: "Success",
              description: "Configuration imported successfully.",
            });
          }
        } catch (error) {
          console.error("Failed to import configuration:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to import configuration. Please check the file format.",
          });
        }
      };
      reader.readAsText(file);
    }
    // Reset file input to allow importing the same file again
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const handlePropChange = useCallback((key: keyof ColorPickerProps, value: any) => {
    setProps({ [key]: value });
  }, [setProps]);

  const defaultValues: ColorPickerProps = {
    value: "#06B5EF", isRTL: false, showContrast: true, colorPreviewAreaText: "A",
    enabledModes: ["hex", "rgb", "hsl"], defaultFormat: "hex", contrastBgLuminance: 0, hexLabel: "HEX",
    rgbLabel: "RGB", hslLabel: "HSL", modeLabel: "Mode", contrastLabel: "Contrast", rLabel: "R", gLabel: "G",
    bLabel: "B", hLabel: "H", sLabel: "S", lLabel: "L", containerBg: "#000", containerBorderColor: "#242424",
    containerBorderWidth: 1, containerRadius: "12px", containerPadding: "16px", containerElementGap: "16px",
    saturationHeight: 140, saturationRadius: 8, saturationBorderColor: "#242424", saturationBorderWidth: 1,
    saturationThumbWidth: 14, saturationThumbHeight: 14, saturationThumbRadius: 50, saturationThumbBorderStyle: "solid",
    saturationThumbBorderWidth: 2, saturationThumbBorderColor: "#ffffff", saturationThumbBgColor: "transparent",
    hueTrackHeight: 10, hueTrackRadius: "8px" as any, hueTrackBorderWidth: 1, hueTrackBorderColor: "transparent",
    hueThumbSize: 16, hueThumbRadius: "50%" as any, hueThumbBorderWidth: 3, hueThumbBgDefault: "#f0f0f0",
    hueThumbBgHover: "#e5e5e5", hueThumbBgActive: "#f0f0f0", hueThumbBorderDefault: "#e5e5e5",
    hueThumbBorderHover: "#f0f0f0", hueThumbBorderActive: "#fff", badgeBorderWidth: 1, badgeBorderRadius: "50px" as any,
    badgeFontSize: "10px" as any, badgeFontWeight: 600, badgeIconSize: 10 as any, badgePadding: "0.25rem 0.5rem",
    badgeIconStrokeWidth: 2.25, badgeBgPass: "rgba(65, 239, 6, 0.1)", badgeBgFail: "rgba(239, 6, 65, 0.1)",
    badgeBorderPass: "rgba(65, 239, 6, 0.5)", badgeBorderFail: "rgba(239, 6, 65, 0.5)", badgeTextPass: "#41EF06",
    badgeTextFail: "#EF0641", contrastLabelSize: "12px", contrastLabelColor: "#737373", contrastLabelWeight: 700,
    contrastValueSize: "14px", contrastValueColor: "#ffffff", contrastValueWeight: 400, contrastFormat: "value:1",
    contrastLabelGap: "0.125rem", contrastItemGap: "16px", contrastBadgeGap: "8px", showContrastAALabel: true,
    showContrastAAALabel: true, contrastAreaTopMargin: "0px", inputHeight: 44, inputBg: "#000",
    inputBorderColor: "#242424", inputBorderWidth: 1, inputRadius: 8, inputTextColor: "#ffffff",
    floatingLabelFocusBorderColor: "#06B5EF", inputErrorOutlineColor: "#EF0641", floatingLabelBg: undefined,
    floatingLabelTextColor: "#777777", floatingLabelActiveTextColor: "#ffffff", floatingLabelRadius: 4,
    floatingLabelBorderColor: undefined, floatingLabelBorderWidth: 0, floatingLabelMainTextSize: 14,
    dropdownHeight: 44, dropdownBg: undefined, dropdownBorderColor: undefined, dropdownBorderWidth: undefined,
    dropdownRadius: undefined, dropdownTextColor: undefined, dropdownFocusBorderColor: undefined,
    dropdownChevronColor: "#6b7280", dropdownMenuBg: "#111111", dropdownMenuBorderColor: "#242424",
    dropdownMenuBorderWidth: 1, dropdownMenuRadius: 10, dropdownMenuTextColor: "#d1d5db",
    dropdownMenuActiveTextColor: "#ffffff", dropdownMenuHoverBg: "rgba(255,255,255,0.05)",
    dropdownMenuActiveBg: "rgba(255,255,255,0.10)", modeDropdownWidth: "128px", modeDropdownFullWidth: false,
    previewBgFallback: "#111111", previewBorderColor: "rgba(255,255,255,0.14)", previewBorderWidth: 1,
    previewRadius: 8, previewFontSize: 18, previewFontWeight: 600, previewTextColor: "#ffffff",
    colorPreviewPosition: "contrast", previewWidth: 44, previewHeight: 44
  };

  return (
    <>
      <SidebarHeader className="border-b p-4">
        <a 
          href="/" 
          className="inline-flex items-center gap-2 p-0 transition-colors duration-300 ease-in-out hover:border-[hsl(var(--accent))] focus-within:border-[hsl(var(--accent))] group/[&>h1]:no-underline focus:outline-none block w-fit h-fit no-underline"
        >
          <img src="logo.webp" alt="Color Picker" width={32} height={32} className="w-8 h-8 flex-shrink-0 cursor-pointer group-hover:brightness-110" />
          <h1 className="text-xl font-headline font-semibold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--accent))] group-focus-within:text-[hsl(var(--accent))] m-0 p-2 cursor-pointer select-none">
            Color Picker Builder
          </h1>
        </a>
      </SidebarHeader>
      <ScrollArea className="flex-1">
        <SidebarContent className="p-0">
          <div className="p-4 space-y-4">
            <div>
              <Label className="text-xs font-semibold">Presets</Label>
              <Select onValueChange={onSetPreset} defaultValue="default">
                <SelectTrigger className="mt-2 h-9">
                  <SelectValue placeholder="Select a preset" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(presets).map((key) => (
                    <SelectItem key={key} value={key}>
                      {presets[key as keyof typeof presets].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Live Preview</Label>
              <div className="grid grid-cols-2 items-center gap-4 mt-2">
                <Label htmlFor="maxWidth" className="text-xs truncate">
                  Max Width (px)
                </Label>
                <Input
                  id="maxWidth"
                  type="number"
                  value={maxWidth}
                  onChange={(e) =>
                    setMaxWidth(parseInt(e.target.value, 10) || 0)
                  }
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>
          <Separator />
          <Accordion type="multiple" defaultValue={["general"]} className="w-full">
            <AccordionItem value="general">
              <AccordionTrigger className="px-4 text-sm font-medium font-headline">
                General
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4 text-sm">
                <PropInput
                  label="Default Color"
                  value={props.value ?? defaultValues.value}
                  onChange={(v: string) => handlePropChange("value", v)}
                />
                <PropSwitch
                  label="Right-to-Left (RTL)"
                  checked={props.isRTL ?? defaultValues.isRTL}
                  onCheckedChange={(v: boolean) =>
                    handlePropChange("isRTL", v)
                  }
                />
                <PropSwitch
                  label="Show Contrast"
                  checked={props.showContrast ?? defaultValues.showContrast}
                  onCheckedChange={(v: boolean) =>
                    handlePropChange("showContrast", v)
                  }
                />
                <PropInput
                  label="Preview Area Text"
                  value={
                    props.colorPreviewAreaText ??
                    defaultValues.colorPreviewAreaText
                  }
                  onChange={(v: string) =>
                    handlePropChange("colorPreviewAreaText", v)
                  }
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="modes">
              <AccordionTrigger className="px-4 text-sm font-medium font-headline">
                Modes & Formats
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4 text-sm">
                <PropSelect
                  label="Default Format"
                  value={props.defaultFormat ?? defaultValues.defaultFormat}
                  onValueChange={(v: string) =>
                    handlePropChange("defaultFormat", v)
                  }
                  options={["hex", "rgb", "hsl"]}
                />
                <PropSwitch
                  label="Full-Width Mode Dropdown"
                  checked={
                    props.modeDropdownFullWidth ??
                    defaultValues.modeDropdownFullWidth
                  }
                  onCheckedChange={(v: boolean) =>
                    handlePropChange("modeDropdownFullWidth", v)
                  }
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="labels">
              <AccordionTrigger className="px-4 text-sm font-medium font-headline">
                Labels
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4 text-sm">
                <PropInput
                  label="HEX Label"
                  value={props.hexLabel ?? defaultValues.hexLabel}
                  onChange={(v: string) => handlePropChange("hexLabel", v)}
                />
                <PropInput
                  label="RGB Label"
                  value={props.rgbLabel ?? defaultValues.rgbLabel}
                  onChange={(v: string) => handlePropChange("rgbLabel", v)}
                />
                <PropInput
                  label="HSL Label"
                  value={props.hslLabel ?? defaultValues.hslLabel}
                  onChange={(v: string) => handlePropChange("hslLabel", v)}
                />
                <PropInput
                  label="Mode Label"
                  value={props.modeLabel ?? defaultValues.modeLabel}
                  onChange={(v: string) => handlePropChange("modeLabel", v)}
                />
                <PropInput
                  label="Red Channel Label"
                  value={props.rLabel ?? defaultValues.rLabel}
                  onChange={(v: string) => handlePropChange("rLabel", v)}
                />
                <PropInput
                  label="Green Channel Label"
                  value={props.gLabel ?? defaultValues.gLabel}
                  onChange={(v: string) => handlePropChange("gLabel", v)}
                />
                <PropInput
                  label="Blue Channel Label"
                  value={props.bLabel ?? defaultValues.bLabel}
                  onChange={(v: string) => handlePropChange("bLabel", v)}
                />
                <PropInput
                  label="Hue Channel Label"
                  value={props.hLabel ?? defaultValues.hLabel}
                  onChange={(v: string) => handlePropChange("hLabel", v)}
                />
                <PropInput
                  label="Saturation Channel Label"
                  value={props.sLabel ?? defaultValues.sLabel}
                  onChange={(v: string) => handlePropChange("sLabel", v)}
                />
                <PropInput
                  label="Lightness Channel Label"
                  value={props.lLabel ?? defaultValues.lLabel}
                  onChange={(v: string) => handlePropChange("lLabel", v)}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="container">
              <AccordionTrigger className="px-4 text-sm font-medium font-headline">
                Container
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4 text-sm">
                <PropInput
                  label="Background"
                  value={props.containerBg ?? defaultValues.containerBg}
                  onChange={(v: string) => handlePropChange("containerBg", v)}
                />
                <PropInput
                  label="Border Color"
                  value={
                    props.containerBorderColor ??
                    defaultValues.containerBorderColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("containerBorderColor", v)
                  }
                />
                <PropInput
                  label="Border Width (px)"
                  value={
                    props.containerBorderWidth ??
                    defaultValues.containerBorderWidth
                  }
                  type="number"
                  step="1"
                  onChange={(v: number) =>
                    handlePropChange("containerBorderWidth", v)
                  }
                />
                <PropInput
                  label="Radius"
                  value={props.containerRadius ?? defaultValues.containerRadius}
                  onChange={(v: string) =>
                    handlePropChange("containerRadius", v)
                  }
                />
                <PropInput
                  label="Padding"
                  value={
                    props.containerPadding ?? defaultValues.containerPadding
                  }
                  onChange={(v: string) =>
                    handlePropChange("containerPadding", v)
                  }
                />
                <PropInput
                  label="Element Gap"
                  value={
                    props.containerElementGap ??
                    defaultValues.containerElementGap
                  }
                  onChange={(v: string) =>
                    handlePropChange("containerElementGap", v)
                  }
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="saturation">
              <AccordionTrigger className="px-4 text-sm font-medium font-headline">
                Saturation Area
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4 text-sm">
                <PropInput
                  label="Height (px)"
                  value={
                    props.saturationHeight ?? defaultValues.saturationHeight
                  }
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("saturationHeight", v)
                  }
                />
                <PropInput
                  label="Radius"
                  value={
                    props.saturationRadius ?? defaultValues.saturationRadius
                  }
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("saturationRadius", v)
                  }
                />
                <PropInput
                  label="Border Color"
                  value={
                    props.saturationBorderColor ??
                    defaultValues.saturationBorderColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("saturationBorderColor", v)
                  }
                />
                <PropInput
                  label="Border Width (px)"
                  value={
                    props.saturationBorderWidth ??
                    defaultValues.saturationBorderWidth
                  }
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("saturationBorderWidth", v)
                  }
                />
                <h3 className="font-semibold text-xs pt-2">Thumb</h3>
                <PropInput
                  label="Width"
                  value={
                    props.saturationThumbWidth ??
                    defaultValues.saturationThumbWidth
                  }
                  onChange={(v: string) =>
                    handlePropChange("saturationThumbWidth", v)
                  }
                />
                <PropInput
                  label="Height"
                  value={
                    props.saturationThumbHeight ??
                    defaultValues.saturationThumbHeight
                  }
                  onChange={(v: string) =>
                    handlePropChange("saturationThumbHeight", v)
                  }
                />
                <PropInput
                  label="Radius"
                  value={
                    props.saturationThumbRadius ??
                    defaultValues.saturationThumbRadius
                  }
                  onChange={(v: string) =>
                    handlePropChange("saturationThumbRadius", v)
                  }
                />
                <PropSelect
                  label="Border Style"
                  value={
                    props.saturationThumbBorderStyle ??
                    defaultValues.saturationThumbBorderStyle
                  }
                  onValueChange={(v: string) =>
                    handlePropChange("saturationThumbBorderStyle", v)
                  }
                  options={["solid", "dashed", "none"]}
                />
                <PropInput
                  label="Border Width (px)"
                  value={
                    props.saturationThumbBorderWidth ??
                    defaultValues.saturationThumbBorderWidth
                  }
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("saturationThumbBorderWidth", v)
                  }
                />
                <PropInput
                  label="Border Color"
                  value={
                    props.saturationThumbBorderColor ??
                    defaultValues.saturationThumbBorderColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("saturationThumbBorderColor", v)
                  }
                />
                <PropInput
                  label="Background Color"
                  value={
                    props.saturationThumbBgColor ??
                    defaultValues.saturationThumbBgColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("saturationThumbBgColor", v)
                  }
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="hue">
              <AccordionTrigger className="px-4 text-sm font-medium font-headline">
                Hue Slider
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4 text-sm">
                <h3 className="font-semibold text-xs">Track</h3>
                <PropInput
                  label="Height"
                  value={props.hueTrackHeight ?? defaultValues.hueTrackHeight}
                  onChange={(v: string) => handlePropChange("hueTrackHeight", v)}
                />
                <PropInput
                  label="Radius"
                  value={props.hueTrackRadius ?? defaultValues.hueTrackRadius}
                  onChange={(v: string) => handlePropChange("hueTrackRadius", v)}
                />
                <PropInput
                  label="Border Width (px)"
                  value={
                    props.hueTrackBorderWidth ??
                    defaultValues.hueTrackBorderWidth
                  }
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("hueTrackBorderWidth", v)
                  }
                />
                <PropInput
                  label="Border Color"
                  value={
                    props.hueTrackBorderColor ??
                    defaultValues.hueTrackBorderColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("hueTrackBorderColor", v)
                  }
                />
                <h3 className="font-semibold text-xs pt-2">Thumb</h3>
                <PropInput
                  label="Size"
                  value={props.hueThumbSize ?? defaultValues.hueThumbSize}
                  onChange={(v: string) => handlePropChange("hueThumbSize", v)}
                />
                <PropInput
                  label="Radius"
                  value={props.hueThumbRadius ?? defaultValues.hueThumbRadius}
                  onChange={(v: string) => handlePropChange("hueThumbRadius", v)}
                />
                <PropInput
                  label="Border Width (px)"
                  value={
                    props.hueThumbBorderWidth ??
                    defaultValues.hueThumbBorderWidth
                  }
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("hueThumbBorderWidth", v)
                  }
                />
                <PropInput
                  label="Background"
                  value={
                    props.hueThumbBgDefault ?? defaultValues.hueThumbBgDefault
                  }
                  onChange={(v: string) =>
                    handlePropChange("hueThumbBgDefault", v)
                  }
                />
                <PropInput
                  label="Background (Hover)"
                  value={
                    props.hueThumbBgHover ?? defaultValues.hueThumbBgHover
                  }
                  onChange={(v: string) =>
                    handlePropChange("hueThumbBgHover", v)
                  }
                />
                <PropInput
                  label="Background (Active)"
                  value={
                    props.hueThumbBgActive ?? defaultValues.hueThumbBgActive
                  }
                  onChange={(v: string) =>
                    handlePropChange("hueThumbBgActive", v)
                  }
                />
                <PropInput
                  label="Border"
                  value={
                    props.hueThumbBorderDefault ??
                    defaultValues.hueThumbBorderDefault
                  }
                  onChange={(v: string) =>
                    handlePropChange("hueThumbBorderDefault", v)
                  }
                />
                <PropInput
                  label="Border (Hover)"
                  value={
                    props.hueThumbBorderHover ??
                    defaultValues.hueThumbBorderHover
                  }
                  onChange={(v: string) =>
                    handlePropChange("hueThumbBorderHover", v)
                  }
                />
                <PropInput
                  label="Border (Active)"
                  value={
                    props.hueThumbBorderActive ??
                    defaultValues.hueThumbBorderActive
                  }
                  onChange={(v: string) =>
                    handlePropChange("hueThumbBorderActive", v)
                  }
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contrast">
              <AccordionTrigger className="px-4 text-sm font-medium font-headline">
                Contrast Area
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4 text-sm">
                <PropInput
                  label="Bg Luminance"
                  value={
                    props.contrastBgLuminance ??
                    defaultValues.contrastBgLuminance
                  }
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  onChange={(v: number) =>
                    handlePropChange("contrastBgLuminance", v)
                  }
                />
                <PropInput
                  label="Label"
                  value={props.contrastLabel ?? defaultValues.contrastLabel}
                  onChange={(v: string) => handlePropChange("contrastLabel", v)}
                />
                <PropInput
                  label="Label Font Size"
                  value={
                    props.contrastLabelSize ?? defaultValues.contrastLabelSize
                  }
                  onChange={(v: string) =>
                    handlePropChange("contrastLabelSize", v)
                  }
                />
                <PropInput
                  label="Label Color"
                  value={
                    props.contrastLabelColor ?? defaultValues.contrastLabelColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("contrastLabelColor", v)
                  }
                />
                <PropInput
                  label="Label Font Weight"
                  value={
                    props.contrastLabelWeight ??
                    defaultValues.contrastLabelWeight
                  }
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("contrastLabelWeight", v)
                  }
                />
                <PropInput
                  label="Value Font Size"
                  value={
                    props.contrastValueSize ?? defaultValues.contrastValueSize
                  }
                  onChange={(v: string) =>
                    handlePropChange("contrastValueSize", v)
                  }
                />
                <PropInput
                  label="Value Color"
                  value={
                    props.contrastValueColor ?? defaultValues.contrastValueColor
                  }
                  onChange={(v_string) =>
                    handlePropChange("contrastValueColor", v_string)
                  }
                />
                <PropInput
                  label="Value Font Weight"
                  value={
                    props.contrastValueWeight ??
                    defaultValues.contrastValueWeight
                  }
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("contrastValueWeight", v)
                  }
                />
                <PropSelect
                  label="Format"
                  value={props.contrastFormat ?? defaultValues.contrastFormat}
                  onValueChange={(v: string) =>
                    handlePropChange("contrastFormat", v)
                  }
                  options={["value:1", "1:value", "value"]}
                />
                <PropInput
                  label="Label Gap"
                  value={
                    props.contrastLabelGap ?? defaultValues.contrastLabelGap
                  }
                  onChange={(v: string) =>
                    handlePropChange("contrastLabelGap", v)
                  }
                />
                <PropInput
                  label="Item Gap"
                  value={props.contrastItemGap ?? defaultValues.contrastItemGap}
                  onChange={(v: string) =>
                    handlePropChange("contrastItemGap", v)
                  }
                />
                <PropInput
                  label="Badge Gap"
                  value={
                    props.contrastBadgeGap ?? defaultValues.contrastBadgeGap
                  }
                  onChange={(v: string) =>
                    handlePropChange("contrastBadgeGap", v)
                  }
                />
                <PropSwitch
                  label="Show AA Label"
                  checked={
                    props.showContrastAALabel ??
                    defaultValues.showContrastAALabel
                  }
                  onCheckedChange={(v: boolean) =>
                    handlePropChange("showContrastAALabel", v)
                  }
                />
                <PropSwitch
                  label="Show AAA Label"
                  checked={
                    props.showContrastAAALabel ??
                    defaultValues.showContrastAAALabel
                  }
                  onCheckedChange={(v: boolean) =>
                    handlePropChange("showContrastAAALabel", v)
                  }
                />
                <PropInput
                  label="Top Margin"
                  value={
                    props.contrastAreaTopMargin ??
                    defaultValues.contrastAreaTopMargin
                  }
                  onChange={(v: string) =>
                    handlePropChange("contrastAreaTopMargin", v)
                  }
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="inputs">
              <AccordionTrigger className="px-4 text-sm font-medium font-headline">
                Inputs
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4 text-sm">
                <PropInput
                  label="Height (px)"
                  value={props.inputHeight ?? defaultValues.inputHeight}
                  type="number"
                  onChange={(v: number) => handlePropChange("inputHeight", v)}
                />
                <PropInput
                  label="Background"
                  value={props.inputBg ?? defaultValues.inputBg}
                  onChange={(v: string) => handlePropChange("inputBg", v)}
                />
                <PropInput
                  label="Border Color"
                  value={
                    props.inputBorderColor ?? defaultValues.inputBorderColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("inputBorderColor", v)
                  }
                />
                <PropInput
                  label="Border Width (px)"
                  value={
                    props.inputBorderWidth ?? defaultValues.inputBorderWidth
                  }
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("inputBorderWidth", v)
                  }
                />
                <PropInput
                  label="Radius"
                  value={props.inputRadius ?? defaultValues.inputRadius}
                  type="number"
                  onChange={(v: number) => handlePropChange("inputRadius", v)}
                />
                <PropInput
                  label="Text Color"
                  value={props.inputTextColor ?? defaultValues.inputTextColor}
                  onChange={(v: string) => handlePropChange("inputTextColor", v)}
                />
                <PropInput
                  label="Error Outline Color"
                  value={
                    props.inputErrorOutlineColor ??
                    defaultValues.inputErrorOutlineColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("inputErrorOutlineColor", v)
                  }
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="floating-labels">
              <AccordionTrigger className="px-4 text-sm font-medium font-headline">
                Floating Labels
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4 text-sm">
                <PropInput
                  label="Focus Border Color"
                  value={
                    props.floatingLabelFocusBorderColor ??
                    defaultValues.floatingLabelFocusBorderColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("floatingLabelFocusBorderColor", v)
                  }
                />
                <PropInput
                  label="Background"
                  value={
                    props.floatingLabelBg ?? defaultValues.floatingLabelBg
                  }
                  onChange={(v: string) =>
                    handlePropChange("floatingLabelBg", v)
                  }
                />
                <PropInput
                  label="Text Color"
                  value={
                    props.floatingLabelTextColor ??
                    defaultValues.floatingLabelTextColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("floatingLabelTextColor", v)
                  }
                />
                <PropInput
                  label="Active Text Color"
                  value={
                    props.floatingLabelActiveTextColor ??
                    defaultValues.floatingLabelActiveTextColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("floatingLabelActiveTextColor", v)
                  }
                />
                <PropInput
                  label="Radius"
                  value={
                    props.floatingLabelRadius ??
                    defaultValues.floatingLabelRadius
                  }
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("floatingLabelRadius", v)
                  }
                />
                <PropInput
                  label="Border Color"
                  value={
                    props.floatingLabelBorderColor ??
                    defaultValues.floatingLabelBorderColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("floatingLabelBorderColor", v)
                  }
                />
                <PropInput
                  label="Border Width (px)"
                  value={
                    props.floatingLabelBorderWidth ??
                    defaultValues.floatingLabelBorderWidth
                  }
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("floatingLabelBorderWidth", v)
                  }
                />
                <PropInput
                  label="Text Size (px)"
                  value={
                    props.floatingLabelMainTextSize ??
                    defaultValues.floatingLabelMainTextSize
                  }
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("floatingLabelMainTextSize", v)
                  }
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dropdown">
              <AccordionTrigger className="px-4 text-sm font-medium font-headline">
                Dropdown
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4 text-sm">
                <h3 className="font-semibold text-xs">Button</h3>
                <PropInput
                  label="Height (px)"
                  value={props.dropdownHeight ?? defaultValues.dropdownHeight}
                  type="number"
                  onChange={(v: number) => handlePropChange("dropdownHeight", v)}
                />
                <PropInput
                  label="Background"
                  value={props.dropdownBg ?? defaultValues.dropdownBg}
                  onChange={(v: string) => handlePropChange("dropdownBg", v)}
                />
                <PropInput
                  label="Border Color"
                  value={
                    props.dropdownBorderColor ??
                    defaultValues.dropdownBorderColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("dropdownBorderColor", v)
                  }
                />
                <PropInput
                  label="Border Width (px)"
                  value={
                    props.dropdownBorderWidth ??
                    defaultValues.dropdownBorderWidth
                  }
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("dropdownBorderWidth", v)
                  }
                />
                <PropInput
                  label="Radius"
                  value={props.dropdownRadius ?? defaultValues.dropdownRadius}
                  type="number"
                  onChange={(v: number) => handlePropChange("dropdownRadius", v)}
                />
                <PropInput
                  label="Text Color"
                  value={
                    props.dropdownTextColor ?? defaultValues.dropdownTextColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("dropdownTextColor", v)
                  }
                />
                <PropInput
                  label="Focus Border Color"
                  value={
                    props.dropdownFocusBorderColor ??
                    defaultValues.dropdownFocusBorderColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("dropdownFocusBorderColor", v)
                  }
                />
                <PropInput
                  label="Chevron Color"
                  value={
                    props.dropdownChevronColor ??
                    defaultValues.dropdownChevronColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("dropdownChevronColor", v)
                  }
                />
                <PropInput
                  label="Width"
                  value={
                    props.modeDropdownWidth ?? defaultValues.modeDropdownWidth
                  }
                  onChange={(v: string) =>
                    handlePropChange("modeDropdownWidth", v)
                  }
                />

                <h3 className="font-semibold text-xs pt-2">Menu</h3>
                <PropInput
                  label="Background"
                  value={props.dropdownMenuBg ?? defaultValues.dropdownMenuBg}
                  onChange={(v: string) =>
                    handlePropChange("dropdownMenuBg", v)
                  }
                />
                <PropInput
                  label="Border Color"
                  value={
                    props.dropdownMenuBorderColor ??
                    defaultValues.dropdownMenuBorderColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("dropdownMenuBorderColor", v)
                  }
                />
                <PropInput
                  label="Border Width (px)"
                  value={
                    props.dropdownMenuBorderWidth ??
                    defaultValues.dropdownMenuBorderWidth
                  }
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("dropdownMenuBorderWidth", v)
                  }
                />
                <PropInput
                  label="Radius"
                  value={
                    props.dropdownMenuRadius ?? defaultValues.dropdownMenuRadius
                  }
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("dropdownMenuRadius", v)
                  }
                />
                <PropInput
                  label="Text Color"
                  value={
                    props.dropdownMenuTextColor ??
                    defaultValues.dropdownMenuTextColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("dropdownMenuTextColor", v)
                  }
                />
                <PropInput
                  label="Active Text Color"
                  value={
                    props.dropdownMenuActiveTextColor ??
                    defaultValues.dropdownMenuActiveTextColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("dropdownMenuActiveTextColor", v)
                  }
                />
                <PropInput
                  label="Hover Background"
                  value={
                    props.dropdownMenuHoverBg ??
                    defaultValues.dropdownMenuHoverBg
                  }
                  onChange={(v: string) =>
                    handlePropChange("dropdownMenuHoverBg", v)
                  }
                />
                <PropInput
                  label="Active Background"
                  value={
                    props.dropdownMenuActiveBg ??
                    defaultValues.dropdownMenuActiveBg
                  }
                  onChange={(v: string) =>
                    handlePropChange("dropdownMenuActiveBg", v)
                  }
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="preview">
              <AccordionTrigger className="px-4 text-sm font-medium font-headline">
                Color Preview
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4 text-sm">
                <PropSelect
                  label="Position"
                  value={
                    props.colorPreviewPosition ??
                    defaultValues.colorPreviewPosition
                  }
                  onValueChange={(v: string) =>
                    handlePropChange("colorPreviewPosition", v)
                  }
                  options={["top", "contrast", "none"]}
                />
                <PropInput
                  label="Width"
                  value={props.previewWidth ?? defaultValues.previewWidth}
                  onChange={(v: string) => handlePropChange("previewWidth", v)}
                />
                <PropInput
                  label="Height (px)"
                  value={props.previewHeight ?? defaultValues.previewHeight}
                  type="number"
                  onChange={(v: number) => handlePropChange("previewHeight", v)}
                />
                <PropInput
                  label="Fallback BG"
                  value={
                    props.previewBgFallback ?? defaultValues.previewBgFallback
                  }
                  onChange={(v: string) =>
                    handlePropChange("previewBgFallback", v)
                  }
                />
                <PropInput
                  label="Border Color"
                  value={
                    props.previewBorderColor ?? defaultValues.previewBorderColor
                  }
                  onChange={(v: string) =>
                    handlePropChange("previewBorderColor", v)
                  }
                />
                <PropInput
                  label="Border Width (px)"
                  value={
                    props.previewBorderWidth ?? defaultValues.previewBorderWidth
                  }
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("previewBorderWidth", v)
                  }
                />
                <PropInput
                  label="Radius (px)"
                  value={props.previewRadius ?? defaultValues.previewRadius}
                  type="number"
                  onChange={(v: number) => handlePropChange("previewRadius", v)}
                />
                <PropInput
                  label="Font Size (px)"
                  value={props.previewFontSize ?? defaultValues.previewFontSize}
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("previewFontSize", v)
                  }
                />
                <PropInput
                  label="Font Weight"
                  value={
                    props.previewFontWeight ?? defaultValues.previewFontWeight
                  }
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("previewFontWeight", v)
                  }
                />
                <PropInput
                  label="Text Color"
                  value={
                    props.previewTextColor ?? defaultValues.previewTextColor
                  }
                  onChange={(v_string) =>
                    handlePropChange("previewTextColor", v_string)
                  }
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="badges">
              <AccordionTrigger className="px-4 text-sm font-medium font-headline">
                Badges
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4 text-sm">
                <PropInput
                  label="Border Width"
                  value={
                    props.badgeBorderWidth ?? defaultValues.badgeBorderWidth
                  }
                  onChange={(v: string) =>
                    handlePropChange("badgeBorderWidth", v)
                  }
                />
                <PropInput
                  label="Radius"
                  value={
                    props.badgeBorderRadius ?? defaultValues.badgeBorderRadius
                  }
                  onChange={(v: string) =>
                    handlePropChange("badgeBorderRadius", v)
                  }
                />
                <PropInput
                  label="Font Size"
                  value={props.badgeFontSize ?? defaultValues.badgeFontSize}
                  onChange={(v: string) => handlePropChange("badgeFontSize", v)}
                />
                <PropInput
                  label="Font Weight"
                  value={props.badgeFontWeight ?? defaultValues.badgeFontWeight}
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("badgeFontWeight", v)
                  }
                />
                <PropInput
                  label="Icon Size"
                  value={props.badgeIconSize ?? defaultValues.badgeIconSize}
                  onChange={(v: string) => handlePropChange("badgeIconSize", v)}
                />
                <PropInput
                  label="Icon Stroke"
                  value={
                    props.badgeIconStrokeWidth ??
                    defaultValues.badgeIconStrokeWidth
                  }
                  type="number"
                  onChange={(v: number) =>
                    handlePropChange("badgeIconStrokeWidth", v)
                  }
                />
                <PropInput
                  label="Padding"
                  value={props.badgePadding ?? defaultValues.badgePadding}
                  onChange={(v: string) => handlePropChange("badgePadding", v)}
                />
                <PropInput
                  label="Pass BG"
                  value={props.badgeBgPass ?? defaultValues.badgeBgPass}
                  onChange={(v: string) => handlePropChange("badgeBgPass", v)}
                />
                <PropInput
                  label="Fail BG"
                  value={props.badgeBgFail ?? defaultValues.badgeBgFail}
                  onChange={(v: string) => handlePropChange("badgeBgFail", v)}
                />
                <PropInput
                  label="Pass Border"
                  value={
                    props.badgeBorderPass ?? defaultValues.badgeBorderPass
                  }
                  onChange={(v: string) =>
                    handlePropChange("badgeBorderPass", v)
                  }
                />
                <PropInput
                  label="Fail Border"
                  value={
                    props.badgeBorderFail ?? defaultValues.badgeBorderFail
                  }
                  onChange={(v: string) =>
                    handlePropChange("badgeBorderFail", v)
                  }
                />
                <PropInput
                  label="Pass Text"
                  value={props.badgeTextPass ?? defaultValues.badgeTextPass}
                  onChange={(v: string) => handlePropChange("badgeTextPass", v)}
                />
                <PropInput
                  label="Fail Text"
                  value={props.badgeTextFail ?? defaultValues.badgeTextFail}
                  onChange={(v: string) => handlePropChange("badgeTextFail", v)}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="p-4">
            <h3 className="text-sm font-medium font-headline mb-4">Config</h3>
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <RefinedChronicleButton
                  onClick={() => fileInputRef.current?.click()}
                  backgroundColor="hsl(var(--background))"
                  textColor="hsl(var(--foreground))"
                  hoverTextColor="hsl(var(--foreground))"
                  borderColor="hsl(var(--border))"
                  borderVisible
                  hoverBorderVisible
                  hoverBorderColor="hsl(var(--primary))"
                  hoverBackgroundColor="hsl(var(--primary))"
                  borderWidth={1}
                  borderRadius="var(--radius)"
                  className="flex-1 h-8"
                >
                  Import
                </RefinedChronicleButton>

                <RefinedChronicleButton
                  onClick={handleExport}
                  backgroundColor="hsl(var(--background))"
                  textColor="hsl(var(--foreground))"
                  hoverTextColor="hsl(var(--foreground))"
                  borderColor="hsl(var(--border))"
                  borderVisible
                  hoverBorderVisible
                  hoverBorderColor="hsl(var(--primary))"
                  hoverBackgroundColor="hsl(var(--primary))"
                  borderWidth={1}
                  borderRadius="var(--radius)"
                  className="flex-1 h-8"
                >
                  Export
                </RefinedChronicleButton>

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="application/json"
                  onChange={handleImport}
                />
              </div>
            </div>
            <Footer />
          </div>
        </SidebarContent>
      </ScrollArea>
    </>
  );
}
