"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageUpload from "./image-upload"
import { cn } from "@/lib/utils"

interface BaseFieldProps {
  label: string
  required?: boolean
  className?: string
  error?: string
}

interface TextFieldProps extends BaseFieldProps {
  type: "text" | "email" | "password" | "number"
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
}

interface TextareaFieldProps extends BaseFieldProps {
  type: "textarea"
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

interface SelectFieldProps extends BaseFieldProps {
  type: "select"
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

interface ImageFieldProps extends BaseFieldProps {
  type: "image"
  value: string
  onChange: (value: string) => void
  category?: string
  placeholder?: string
}

type FormFieldProps = TextFieldProps | TextareaFieldProps | SelectFieldProps | ImageFieldProps

export default function FormField(props: FormFieldProps) {
  const { label, required, className, error } = props

  const renderField = () => {
    switch (props.type) {
      case "text":
      case "email":
      case "password":
      case "number":
        return (
          <Input
            type={props.type}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            required={required}
            className={error ? "border-red-500" : ""}
          />
        )

      case "textarea":
        return (
          <Textarea
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            rows={props.rows || 3}
            required={required}
            className={error ? "border-red-500" : ""}
          />
        )

      case "select":
        return (
          <Select value={props.value} onValueChange={props.onChange} required={required}>
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {props.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "image":
        return (
          <ImageUpload
            value={props.value}
            onChange={props.onChange}
            category={props.category}
            placeholder={props.placeholder}
            className={error ? "border-red-500" : ""}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
