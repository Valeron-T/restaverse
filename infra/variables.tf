variable "location" {
  type        = string
  description = "Location where resource is deployed"
  default     = "centralindia"
}

variable "resource_group_name" {
  type        = string
  description = "Resource group name"
}

variable "vm_type" {
  type = string
  description = "VM instance type. Example: Standard_B1s, Standard_B2s etc."
}

variable "vm_username" {
  type = string
  description = "VM username for admin acc"
}

variable "vm_password" {
  type = string
  description = "VM password for admin acc"
}

variable "public_ip_domain_name_label" {
  type = string
  description = "ONLY label for auto generated FQDN to access the website. Format: label.azure_region.cloudapp.azure.com. Keep as unique as possible."
}