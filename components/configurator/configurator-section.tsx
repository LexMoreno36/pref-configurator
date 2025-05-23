"use client"

import { useConfigurator, type ConfigOption } from "./configurator-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OptionWidget } from "./option-widgets"

export function ConfiguratorSection({
  tab,
  section,
}: {
  tab: string
  section: string
}) {
  const { getSectionOptions } = useConfigurator()
  const options = getSectionOptions(tab, section)

  if (options.length === 0) return null

  return (
    <Card className="w-full overflow-hidden border-gray-200 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="bg-gray-50 pb-3">
        <CardTitle className="text-base font-medium text-gray-800">{section}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 w-full">
        {options.map((option) => (
          <OptionItem key={option.Code} option={option} />
        ))}
      </CardContent>
    </Card>
  )
}

function OptionItem({ option }: { option: ConfigOption }) {
  const { selectedOptions, updateOption } = useConfigurator()

  const handleChange = (value: string) => {
    updateOption(option.Code, value)
  }

  const currentValue = selectedOptions[option.Code] || option.ValueString

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center text-sm font-medium text-gray-700">
        {option.Code.split("~")[1]}
        {option.Description && <span className="ml-1 text-xs text-gray-500">({option.Description})</span>}
      </div>
      <OptionWidget option={option} value={currentValue} onChange={handleChange} />
    </div>
  )
}
