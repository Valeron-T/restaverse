resource "azurerm_resource_group" "portal-rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_virtual_network" "portal-vnet" {
  name                = "portal-vnet"
  resource_group_name = azurerm_resource_group.portal-rg.name
  location            = azurerm_resource_group.portal-rg.location
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "portal-subnet" {
  name                 = "portal-subnet"
  resource_group_name  = azurerm_resource_group.portal-rg.name
  virtual_network_name = azurerm_virtual_network.portal-vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_network_security_group" "portal-nsg" {
  name                = "portal-nsg"
  resource_group_name = azurerm_resource_group.portal-rg.name
  location            = azurerm_resource_group.portal-rg.location

  security_rule {
    name                       = "Allow_HTTP"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "Allow_SSH"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "Allow_Port_5000"
    priority                   = 120
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "5000"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_public_ip" "portal-public-ip" {
  name                = "portal-public-ip"
  resource_group_name = azurerm_resource_group.portal-rg.name
  location            = azurerm_resource_group.portal-rg.location
  allocation_method   = "Static"
  domain_name_label   = var.public_ip_domain_name_label
}

resource "azurerm_network_interface" "portalvm-nic" {
  name                = "portalvm-nic"
  location            = azurerm_resource_group.portal-rg.location
  resource_group_name = azurerm_resource_group.portal-rg.name


  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.portal-subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.portal-public-ip.id
  }

}

resource "azurerm_network_interface_security_group_association" "portal-bind-nsg" {
  network_interface_id      = azurerm_network_interface.portalvm-nic.id
  network_security_group_id = azurerm_network_security_group.portal-nsg.id
}

resource "azurerm_linux_virtual_machine" "portal-vm" {
  name                            = "portal-vm"
  resource_group_name             = azurerm_resource_group.portal-rg.name
  location                        = azurerm_resource_group.portal-rg.location
  size                            = var.vm_type
  admin_username                  = var.vm_username
  admin_password                  = var.vm_password
  network_interface_ids           = [azurerm_network_interface.portalvm-nic.id]
  disable_password_authentication = false

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "StandardSSD_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }

  connection {
    type     = "ssh"
    user     = var.vm_username
    password = var.vm_password
    host     = azurerm_linux_virtual_machine.portal-vm.public_ip_address
    port     = 22
  }
  provisioner "file" {
    source      = "deploy_with_docker.sh"
    destination = "/tmp/deploy_with_docker.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "/bin/bash /tmp/deploy_with_docker.sh"
    ]
  }

}
