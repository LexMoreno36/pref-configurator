"use client"

import type { ConfigOption } from "./configurator-context"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { extractColorCode, getHexColor, getColorName } from "@/lib/color-utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DimensionsWidget } from "./dimensions-widget"

export function OptionWidget({
  option,
  value,
  onChange,
}: {
  option: ConfigOption
  value: string
  onChange: (value: string) => void
}) {
  switch (option.Widget) {
    case "Checkbox":
      return <CheckboxWidget option={option} value={value} onChange={onChange} />
    case "Dropdown":
      return <DropdownWidget option={option} value={value} onChange={onChange} />
    case "ColorPicker":
      return <ColorPickerWidget option={option} value={value} onChange={onChange} />
    case "DimensionsWidget":
      return <DimensionsWidget />
    default:
      return <div className="text-sm text-red-500">Unknown widget type: {option.Widget}</div>
  }
}

function CheckboxWidget({
  option,
  value,
  onChange,
}: {
  option: ConfigOption
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="w-full">
      <RadioGroup value={value} onValueChange={onChange} className="flex w-full flex-wrap gap-2">
        {option.Values.map((optionValue) => (
          <div key={optionValue.ValueString} className="flex items-center space-x-2">
            <RadioGroupItem
              value={optionValue.ValueString}
              id={`${option.Code}-${optionValue.ValueString}`}
              className="border-orange-500 text-orange-500 focus:ring-orange-500"
            />
            <Label
              htmlFor={`${option.Code}-${optionValue.ValueString}`}
              className={cn(
                "text-sm transition-colors",
                value === optionValue.ValueString ? "font-medium text-orange-700" : "text-gray-600",
              )}
            >
              {optionValue.ValueString}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

function DropdownWidget({
  option,
  value,
  onChange,
}: {
  option: ConfigOption
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="w-full">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full border-gray-300 bg-white focus:border-orange-500 focus:ring-orange-500">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {option.Values.map((optionValue) => (
            <SelectItem key={optionValue.ValueString} value={optionValue.ValueString} className="focus:bg-orange-50">
              {optionValue.ValueString.includes("~")
                ? extractColorCode(optionValue.ValueString)
                : optionValue.ValueString}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function ColorPickerWidget({
  option,
  value,
  onChange,
}: {
  option: ConfigOption
  value: string
  onChange: (value: string) => void
}) {
  return (
    <TooltipProvider>
      <div className="w-full space-y-3">
        <div className="flex w-full flex-wrap max-h-48 overflow-y-auto">
          {option.Values.map((optionValue) => {
            const colorCode = extractColorCode(optionValue.ValueString)
            const backgroundColor = getHexColor(optionValue.ValueString, "#cccccc")
            const colorName = getColorName(optionValue.ValueString)
            const isSelected = value === optionValue.ValueString

            return (
              <Tooltip key={optionValue.ValueString}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onChange(optionValue.ValueString)}
                    className={cn(
                      "group m-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full p-1 transition-all",
                      isSelected
                        ? "ring-2 ring-orange-500 ring-offset-2"
                        : "hover:ring-1 hover:ring-orange-300 hover:ring-offset-1",
                    )}
                  >
                    <span
                      className={cn(
                        "h-full w-full rounded-full shadow-sm transition-transform",
                        isSelected ? "scale-90" : "group-hover:scale-95",
                      )}
                      style={{ backgroundColor }}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {colorName} ({colorCode})
                  </p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
        <div className="text-xs font-medium text-gray-500">
          Selected:{" "}
          <span className="text-orange-600">
            {getColorName(value)} ({extractColorCode(value)})
          </span>
        </div>
      </div>
    </TooltipProvider>
  )
}
