# Creating a Sector-by-Sector Backup with Clonezilla  

This guide explains how to safely create a sector-by-sector backup of your disk using Clonezilla.  

## Creating a Bootable Clonezilla USB Stick  

Before proceeding with the backup, you need to create a bootable Clonezilla USB stick.  

### Steps to Create a Bootable USB Stick:  
1. Download the latest **Clonezilla Live ISO** from the [official website](https://clonezilla.org/downloads.php).  
2. Use a tool such as **Rufus**, **Balena Etcher**, or **Tuxboot** to create a bootable USB.  
3. Insert your USB drive and select the downloaded ISO as the source.  
4. Start the process and wait for it to complete.  

You now have a bootable Clonezilla USB stick and can proceed with the backup.  

## Methods to Start Clonezilla  

There are two ways to boot Clonezilla and start the backup process.  

### Method 1: Booting from USB  
1. Insert the Clonezilla USB stick into your computer.  
2. Restart your computer and enter the boot menu by pressing the appropriate key (e.g., `F8`, `F12`, `Esc`, or another key depending on your motherboard).  
3. Select the USB stick as the boot device.  

### Method 2: Changing Boot Order in BIOS  
1. Access the BIOS using the key for your system (varies by manufacturer).  
2. Navigate to the **Boot Order** settings and set the USB stick as the first boot device.  
3. Save changes and restart your computer.  

Once Clonezilla boots, follow the backup instructions below.  

## Performing a Sector-by-Sector Backup  

### Step 1: Start Clonezilla  
1. Wait for the Clonezilla Live menu to appear.  
2. Select **Clonezilla Live (Default settings, VGA 800x600)** and press `[ENTER]`.  

### Step 2: Select Language and Keyboard Layout  
1. Choose your preferred language and press `[ENTER]`.  
2. For keymap settings, select **Don't touch keymap** and press `[ENTER]`.  
3. At the start menu, select **Start Clonezilla** and press `[ENTER]`.  

### Step 3: Choose the Clonezilla Mode  
1. Select **device-image** mode (to store the backup as an image) and press `[ENTER]`.  
2. Select **local_dev** (to use a local storage device) and press `[ENTER]`.  

### Step 4: Select the Backup Storage Location  
1. Wait for Clonezilla to detect all connected storage devices.  
2. Select the storage device where the backup will be saved and press `[ENTER]`.  
3. Navigate to the target directory and press `[ENTER]`.  

### Step 5: Choose Backup Type  
1. Select **savedisk** (to back up the entire disk) and press `[ENTER]`.  

### Step 6: Select the Disk to Backup  
1. Choose the source disk (the disk to be cloned) and press `[ENTER]`.  

### Step 7: Configure Advanced Options  
1. Select **Expert mode** and press `[ENTER]`.  
2. Choose **-q2 (Use dd for full sector-by-sector copy)** and press `[ENTER]`.  

### Step 8: Start the Backup Process  
1. Select any additional options as needed and press `[ENTER]`.  
2. Confirm the settings and press `[ENTER]`.  
3. Start the backup process and let Clonezilla complete the cloning.  

### Step 9: Complete the Backup  
1. Once the process finishes, safely remove the USB stick.  
2. Shut down or restart the system.  

Your disk is now successfully backed up with a sector-by-sector copy using Clonezilla.
