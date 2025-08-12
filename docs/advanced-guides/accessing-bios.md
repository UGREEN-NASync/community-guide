# Accessing the BIOS

This guide explains how to safely access the BIOS of your Ugreen NASync device and make important initial configurations.

## Methods to Access BIOS

There are two simple methods to access the BIOS/Boot-Menu of your NASync:

### Method 1: Keyboard Shortcuts
During boot, continuously press either of these key combinations:
- `Ctrl + F2`
- `Ctrl + F12`

### Method 2: SSH Command
If you have SSH access enabled in UG-OS:
1. Login to your device via SSH
2. Execute the following command:
```bash
systemctl reboot --firmware-setup
```

> [!WARNING]
> Some unofficial guides suggest renaming the EFI folder in the boot partition. This method is **not recommended** as it unnecessarily modifies the boot partition and could potentially cause issues.

## Important BIOS Configuration

### Disabling the Watchdog
The watchdog is a security feature that will restart your device if UG-OS is not running. This can interfere with BIOS configuration and alternative OS installations.


> [!IMPORTANT] 
> It's recommended to disable the watchdog as your first action in BIOS because:
> 1. Being in BIOS counts as "UG-OS not running"
> 2. The watchdog will force a restart after a few minutes if not disabled
> 3. This can interrupt your BIOS configuration process


**Steps to disable watchdog:**
1. Enter BIOS using one of the methods above
2. Navigate to the watchdog settings
3. Disable the watchdog feature
4. Save changes and reset
5. Re-enter BIOS to safely continue your configuration

After disabling the watchdog, you can freely explore and configure other BIOS settings without time constraints.

::: info Credit
This guide is based on the work of [Florian Faber](https://www.flofaber.com/log/ugreen-nas)
:::
