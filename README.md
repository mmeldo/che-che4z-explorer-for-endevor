# Explorer for Endevor <!-- omit in toc -->

<div id="header" align="center">

[![Build Status](https://ci.eclipse.org/che4z/buildStatus/icon?job=endevorExplorer%2Fdevelopment)](https://ci.eclipse.org/che4z/job/endevorExplorer/job/master/)
[![GitHub issues](https://img.shields.io/github/issues-raw/eclipse/che-che4z-explorer-for-endevor)](https://github.com/eclipse/che-che4z-explorer-for-endevor/issues)
[![slack](https://img.shields.io/badge/chat-on%20Slack-blue)](https://communityinviter.com/apps/che4z/code4z)

</div>

The Explorer for Endevor VS Code extension modernizes the way you interact with Endevor and offers a user-friendly and convenient way to work with elements and inventory locations. Explorer for Endevor includes the following features:

- Work with multiple Endevor inventory locations
- Filter elements in the tree
- Fetch elements from up the Endevor map
- Add an element
- View an element
- Edit an element
- Retrieve an element with dependencies
- View element details
- Perform a Generate action
- Print a listing
- Read team configuration files and Zowe CLI profiles (including Zowe base profiles)
- Create and synchronize an Endevor workspace

Explorer for Endevor is a part of the [Che4z](https://github.com/eclipse/che-che4z) open-source project. The extension is also part of [Code4z](https://marketplace.visualstudio.com/items?itemName=broadcomMFD.code4z-extension-pack), an all-round package that offers a modern experience for mainframe application developers, including extensions for language support, data editing, testing, and source code management.

## Table of Contents <!-- omit in toc -->

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Get Started Walkthroughs](#get-started-walkthroughs)
  - [Create an Endevor Connection](#create-an-endevor-connection)
  - [Create an Endevor Inventory Location](#create-an-endevor-inventory-location)
- [Workspace Synchronization](#workspace-synchronization)
- [Use Cases](#use-cases)
- [Base Profiles](#base-profiles)
- [Team Configuration File](#team-configuration-file)
- [Manage the Extension Tree](#manage-the-extension-tree)
- [Environment Variables](#environment-variables)
- [Configure Explorer for Endevor](#configure-explorer-for-endevor)
- [List of Limitations](#list-of-limitations)
- [Contribute to Explorer for Endevor](#contribute-to-explorer-for-endevor)
- [Eclipse Che4z](#eclipse-che4z)
- [Zowe Conformance Program](#zowe-conformance-program)
- [Privacy Notice](#privacy-notice)
- [Technical Assistance and Support for Explorer for Endevor](#technical-assistance-and-support-for-explorer-for-endevor)

## Prerequisites

Ensure that you meet the following prerequisites before you use Explorer for Endevor:

**Client-side prerequisites**:

- Access to Endevor.
- Visual Studio Code version 1.58 or higher.

**Host-side prerequisites**:

- Either Endevor version 18.0.12 with the SO09580 and SO09581 PTFs or Endevor version 18.1 with the SO15978 PTF.
- Endevor Web Services.

## Getting Started

Create an Endevor connection and Endevor inventory location and review use cases to see how you can use the full potential of Explorer for Endevor. Alternatively, use your existing Zowe CLI Endevor profiles to get started.

With the 1.4.0 release, Explorer for Endevor introduces a feature that enables you to filter the elements in the tree by names and/or last action CCID. For more information, see the [Filter Elements](#filter-elements) section in this Readme.

From now on, the default behavior of the extension is to display the elements from the inventory location only. However, you can use a new functionality that combines the Endevor **Build using map** and **Return first found** options to display the first found elements from up the Endevor map in the tree. For more information, see the [Fetch Elements from up the Map](#fetch-elements-from-up-the-map) section in this Readme.

With the 1.2.0 release, Explorer for Endevor introduces a new setting — **Profiles: Keep in Sync**. The setting enables you to use team configuration files. The profiles sync setting is enabled by default. With this setting enabled, the extension automatically reads available team configuration files or Endevor profiles and Endevor location profiles on startup. The default location of team config files and Endevor profiles is `~/.zowe` or `C:\Users\.zowe`. Learn more about team configuration files in the [Team Configuration File](#team-configuration-file) section. For more information about the new setting, see [Configure Explorer for Endevor](#configure-explorer-for-endevor) in this Readme.

**Note**: The term `connection` has the same connotation as the term `profile` starting from the 1.2.0 release and pertains to all `profiles` that are created in the extension.

### Get Started Walkthroughs

VS Code enables you to review walkthroughs to get started with Explorer for Endevor. The walkthrough contains short guides that help you get familiar with the extension features.

1. Click **Help** in the menu bar.

2. Select **Get Started** from the drop-down menu.

3. Select the **Get Started with Explorer for Explorer** walkthrough or click **More...** to select the walkthrough if it is not displayed immediately.

4. Select a feature that you want to discover.

### Create an Endevor Connection

Create an Endevor connection.

1. Click the **Add a New Endevor Connection** button to add an Endevor connection.

   Alternatively, select your existing Endevor connections.

2. Select **Create a new Endevor Connection**.
3. Enter a name for your connection.
4. Enter your [Endevor Web Services URL](https://techdocs.broadcom.com/us/en/ca-mainframe-software/devops/ca-endevor-software-change-manager/18-0/installing/how-to-enable-web-services/install-and-set-up-ca-endevor-scm-web-services/validate-web-services.html) in the `http(s)://host:port/basePath` format.

   - Depending on the Endevor connections you use, you can include `EndevorService/api/v1`, `EndevorService/rest` or `EndevorService/api/v2` in `basePath`. If `basePath` is omitted, the default is `EndevorService/api/v2`.
   - Explorer for Endevor checks if the specified URL is accessible. If not, you are prompted to either change the specified value or proceed without changing the value.
   - You might be prompted to either accept or reject connections with self-signed certificates if the extension encounters an issue with the server certificate issuer validation in the connection testing phase. If no issues are found, the prompt does not appear and the value is set to `reject`.

5. (Optional) Enter your username and password to add your mainframe credentials to the connection.

   Adding your credentials to your connection enables you to access different inventory locations without the need to enter your credentials more than once.

   **Notes**:

   - If your connection does not include credentials during the first session of Explorer for Endevor, you are prompted to enter credentials.
   - Passwords with 9 or more characters are treated as a _passphrase_ by the server and are case-sensitive.

Your new connection is now available in the tree.

### Create an Endevor Inventory Location

Once you have an Endevor connection, you need to add an inventory location. An inventory location consists of an Endevor instance, Endevor path with environment, system, subsystem, stage number, element type, CCID, and Comment. Inventory locations enable you to view and work with elements of specified Endevor locations.

1. Click the **+** icon next to your Endevor connection to add a new inventory location.
2. Create a name for the inventory location and press Enter.
3. Select an instance from the drop-down menu and press Enter.
4. Enter the Endevor path and press Enter.

   The path has the `environment/stagenumber/system/subsystem/type` format.

   **Notes**:

   - If you are unsure about the system, subsystem, or type parameters, you can substitute any of these parameters with a `\*` wildcard.
   - The elements search function is executed with the `Build using map` Endevor list option.

5. (Optional) Enter CCID and press Enter.
6. (Optional) Enter a comment and press Enter.

   - If you want to skip the CCID and/or comment step, you can leave the inputs blank by pressing Enter.
   - You can cancel the creation of Endevor inventory location at any step by pressing Escape.

You successfully created an inventory location.

## Workspace Synchronization

A synchronized Endevor workspace enables you to work with inventory locations locally and synchronize elements from and to Endevor on the mainframe. You can create an Endevor workspace in your VS Code by enabling the **Workspace Sync** setting in the extension settings. Synchronized elements appear in the selected folder and you can see them in the **File Explorer** panel. You can manage the workspace from VSCode with Explorer for Endevor extension installed.

**Note:** The feature is experimental in Explorer for Endevor 1.3.0.

For more information on the setting, see [Configure Explorer for Endevor](#configure-explorer-for-endevor) in this Readme.

To learn more about the Endevor Workspace synchronization feature, read [this article](https://medium.com/modern-mainframe/editing-synchronized-endevor-elements-locally-ff096d09eb5e) on Medium or review [the extension walkthroughs](#get-started-walkthroughs) in VS Code.

## Use Cases

Review the following use cases to familiarize yourself with the basic Explorer for Endevor features:

- [Filter elements](#filter-elements): Filter one or multiple elements by names or last action CCID.
- [Fetch elements from up the Endevor map](#fetch-elements-from-up-the-map): Fetch the first found elements from up the Endevor map.
- [Add an element](#add-an-element): Upload an element from your workstation to a chosen Endevor inventory location.
- [View an element](#view-an-element): View the contents, summary report, and source level information of the selected element.
- [View details](#view-details): View the details of a chosen element. The details include the environment, stage, system, subsystem, element type, and the name and extension of the element.
- [Retrieve an element](#retrieve-an-element): Download the selected element.
- [Retrieve an element with dependencies](#retrieve-an-element-with-dependencies): You can download the selected element with dependencies.
- [Edit](#edit): The Edit action enables you to download an element to your workspace, edit, and upload the selected element step by step. Once you are done with editing the element, press CTRL+S or Command+S to upload the edited element back.
- [Generate](#generate): Call the Generate action for an element to invoke the Generate Processor that creates an executable form of the element.
- [Print a listing](#print-a-listing): Reveal the output of the performed Generate action.
- [Sign out](#sign-out): Lock an Endevor element so that the element is only editable by you.
- [Sign in](#sign-in): Let you unlock a locked element. You can only unlock the elements that were locked by you.

### Filter Elements

You apply a filter or multiple filters to the Endevor elements that were fetched into the tree. Filters enable you to display the specified elements only.

1. Hover over an inventory location in the tree.

   The **Filter an Inventory Location** icon appears on the right side of the panel.

2. Click the **Filter an Inventory Location** icon to set a filter for one or more elements.

   The dialog with the following options appears:

   - Select the **By Element Name** option.

     The Explorer dialog appears. Type a name(s) to filter by. Use a comma to separate multiple values.

   - Select the **By Element Last Action CCID** option.

     The Explorer dialog appears. Type a last action CCID to filter by. Use a comma to separate multiple values.

3. Press Enter to confirm your choice.

   A **Filtered** row appears in the tree. You can expand the row to see what filters are applied to the inventory location.

4. (Optional) Edit or remove your filters by clicking the **Edit filter** or **Clear filter value** options respectively. The options appear when you hover over the filter names.

![Filter Elements](packages/explorer-for-endevor/images/E4E-filter-elements.gif?raw=true 'Filter Elements')
<br /><br />

You successfully set a filter for your inventory location.

### Fetch Elements from up the Map

Both **Build using map** and **Return first found** Endevor search element options are combined to fetch first found elements from up the map into the tree.

1. Hover over an inventory location in the tree.

   The **Show Endevor elements from up the map** icon appears on the right side of the panel.

2. Click the **Show Endevor elements from up the map** icon.

   The elements from up the Endevor map appear in the tree.

3. (Optional) You can switch back to the elements from the inventory location only view by clicking the **Show Endevor elements in place**.

![Show Endevor Elements from up the Map](packages/explorer-for-endevor/images/E4E-up-the-map.gif?raw=true 'Show Endevor Elements from up the Map')
<br /><br />

You successfully fetched the elements from up the map.

### Add an Element

You can upload a new element to your inventory location. The uploaded element appears under the selected type in the tree.

1. Hover over an inventory location in the tree.

   The **Add an Element** icon appears on the right side of the panel.

2. Click the **Add an Element** icon to upload a new element.

   The Explorer dialog appears. You can now select an element that you want to upload from your workstation.

3. Select an element that you want to upload from your workstation.

![Add an Element](packages/explorer-for-endevor/images/E4E-add.gif?raw=true 'Add an Element')
<br /><br />

You successfully added the element.

### View an Element

You can view the contents, summary, and source level information of an element by clicking on the element in the tree. The chosen element appears in the editor area. Viewing the contents of the element allows you to determine if you want to retrieve and work with the element.

1. Hover over an element that you want to view.
2. Click the element to see the contents of the element.

   The contents of the element appear in the editor area.

![View an Element](packages/explorer-for-endevor/images/E4E-view.gif?raw=true 'View an Element')
<br /><br />

### View Details

The inventory location details of an element you want to view appear in the editor area in a separate tab.

1. Right-click an element.
2. Select the **View Details** option.

   The details of the element appear in the editor area.

![View Details](packages/explorer-for-endevor/images/E4E-view-details.gif?raw=true 'View Details')
<br /><br />

### Retrieve an Element

You can download an element to your workspace and work with the element locally.

1. Right-click an element.
2. Select the **Retrieve** option.

   The extension downloads and places the element into your workspace. The contents of the element appear in the editor area. You can find the element in the workspace folder.

You successfully retrieved the element.

![Retrieve an Element](packages/explorer-for-endevor/images/E4E-retrieve.gif?raw=true 'Retrieve an Element')
<br /><br />

### Retrieve an Element with Dependencies

You can download an element with dependencies to your workspace and work with the element and the dependencies locally.

1. Right-click an element.
2. Select the **Retrieve with dependencies** option.

   The extension downloads and places the element with dependencies into your workspace. The contents of the element appear in the editor area.

You successfully retrieved the element with dependencies.

![Retrieve with Dependencies](packages/explorer-for-endevor/images/E4E-retrieve-dep.gif?raw=true 'Retrieve with Dependencies')
<br /><br />

### Edit

The **Edit** action lets you download an element, edit, and upload the element back.

1. Right-click an element.
2. Select the **Edit** option.

   The contents of the element appear in the editor area. You can now edit the element.

3. Press **CTLR+S** or **Command+S** when you want to save and upload the edited element back.
4. Specify any accessible Endevor path and a name for the element.
5. Enter a CCID.
6. Enter a comment.
7. (Optional) Resolve conflicts between the element versions if necessary.

   **Notes:**

   - The behavior of the conflict resolution feature differs in Theia.

   - (Theia only) When you resolve a conflict, open the Command Palette by pressing **CTRL+SHIFT+P** or **CMD+SHIFT+P** and use one of the following commands: `Accept changes` or `Discard changes`.

You successfully edited, saved, and uploaded the element.

![Retrieve with Dependencies](packages/explorer-for-endevor/images/E4E-edit.gif?raw=true 'Retrieve with Dependencies')
<br /><br />

### Generate

The **Generate** action creates an executable form of the element, together with any associated outputs such as listings, and has the following available options:

- **Generate in Place** enables you to generate the selected element in the same location where the element resides.

- **Generate with Copyback** enables you to copy the selected element back from up the map to the target location first and then generate the element in that location.

- **Generate with No Source** enables you to generate an element in the target location, using the source of the selected element from up the map. In this case, the source is not fetched to the target location and the sourceless element is created.

You can use the **Generate in Place**, **Generate with Copyback**, or **Generate with No Source** context menu options to perform the Endevor Generate action for a selected element.

1. Select one of the following options:

   - Right-click an element and select the **Generate in Place** option.

     ![Generate in Place](packages/explorer-for-endevor/images/E4E-Generate-in-Place.gif?raw=true 'Generate in Place')
     <br /><br />

   - Right-click an element from up the map and select the **Generate with Copy back** option.

     ![Generate with Copy back](packages/explorer-for-endevor/images/E4E-Generate-Copyback.gif?raw=true 'Generate with Copy back')
     <br /><br />

   - Right-click an element from up the map and select the **Generate with No Source** option.

   A successfully-performed Generate action shows a notification pop-up with the **Print a listing** and **Cancel** options and the following message:

   ```text
   Successfully generated the elements: ... Would you like to see the listing?
   ```

2. (Optional) Click **Print a listing** to see the Generate output.

   **Note**: You can always review the Generate output by selecting the **Print a listing** option.

You successfully performed the Generate action.

If Generate fails to process an element, the listing is displayed automatically.

### Print a Listing

The **Print a listing** option enables you to display the most recently created listing.

1. Right-click an element.
2. Select the **Print a listing** option.

   The contents of the listing appear in the editor area.

You successfully printed the listing.

![Print Listing](packages/explorer-for-endevor/images/E4E-Print-Listing.gif?raw=true 'Print Listing')
<br /><br />

### Sign Out

The **Sign out** option enables you to lock an element, which prevents other users from editing the element.

1. Right-click an element.
2. Select the **Sign out** option.
3. Enter a CCID.
4. Enter a comment.

You successfully signed out the element.

![Sign Out](packages/explorer-for-endevor/images/E4E-signout.gif?raw=true 'Sign Out')
<br /><br />

### Sign In

The **Sign in** option enables you to unlock an element that earlier was signed out by you.

1. Right-click an element.
2. Select the **Sign in** option.

You successfully signed in the element.

## Base Profiles

Explorer for Endevor enables you to use Zowe CLI base profiles. To make your default base profile work in the extension, ensure that you specify such parameters as username, password, host, port, and rejectUnauthorized in the base profile. For more information, see [the Base Profile section](https://docs.zowe.org/stable/user-guide/cli-using-using-profiles/#base-profiles) on Zowe Docs.

## Team Configuration File

Explorer for Endevor supports reading a global team configuration (team config) file. A team configuration file enables you to manage your Endevor connection details efficiently in one location. You can use global team configs with your team members to share access to Endevor inventory locations. For more information about team config, see [Using Team Profiles](https://docs.zowe.org/stable/user-guide/cli-using-using-team-profiles) on Zowe Docs. The extension reads team configuration files only if the profile sync setting is enabled. To configure the setting, navigate to > **Settings** > **Extensions** > **Explorer for Endevor** > **Profiles: Keep in sync**.

As an application developer, you can obtain a shared global configuration file from your system administrator and use the file to access shared systems. As a system administrator, you need to have [Zowe CLI 7.2.1](https://docs.zowe.org/stable/user-guide/cli-installcli) or higher on your workstation before you create a team configuration file.

> **Tip**: You can convert your existing Zowe CLI profiles into team configuration files with the `zowe config convert-profiles` command. For more information about team config conversion, see [Using Profiles](https://docs.zowe.org/stable/user-guide/cli-using-using-profiles/#important-information-about-team-profiles) on Zowe Docs.

## Manage the Extension Tree

You can perform the following actions to manage your connections and inventory locations in the extension tree:

- **Delete a connection**: Delete your connection permanently by right-clicking a connection node and selecting the **Delete a connection** option.

- **Delete an inventory location**: Delete your inventory location permanently by right-clicking an inventory location node and selecting the **Delete an inventory location** option.

- **Hide a connection**: If you do not want to list your connections in the tree, you can hide such connections. To hide a connection, right-click the connection node and select the **Hide a connection** option.

- **Hide an inventory location**: If you do not want to list your inventory locations in the tree, you can hide such locations. To hide an inventory location, right-click the location node and select the **Hide an inventory location** option.

  **Note:** The **Hide a connection** or **Hide an inventory location** actions do not permanently delete the information from the extension.

## Configure Explorer for Endevor

You can configure the following settings of the extension:

- The number of parallel HTTP requests supported by Endevor.

- Automatic Signout. The signout function locks elements for you. If the option is enabled, retrieved or edited elements are signed out to you. If an element is signed out to somebody else, a notification asking whether to override the signout pops up. If the option is disabled, the extension retrieves or edits an element without signout.

- Telemetry level. You can disable or configure data that is collected by Telemetry in the VS Code Settings. Navigate to **Settings** > **Application** > **Telemetry** > **Telemetry Level** to do so. For more information, see [Disable Telemetry](https://code.visualstudio.com/docs/getstarted/telemetry#_disable-telemetry-reporting) in the VS Code documentation.

  **Note:** This setting applies not only to Explorer for Endevor but to all extensions in your VS Code.

- Profiles: Keep in Sync. The option enables you to use a team configuration file that stores your pre-saved Endevor configuration or Zowe CLI Endevor profiles with Endevor locations in the extension. By default, the setting is enabled, meaning that the extension reads your team configuration files on startup and displays profile information in the Tree View. If the option is disabled, the extension does not check the `.zowe` folder for available profiles.

  **Notes**:

  - You can use Endevor connections and inventory locations that are created in Explorer for Endevor in the extension only.

- File extension resolution. The option enables you to choose between the following methods of file extension resolution for the locally saved elements.

  - 'Element name only' method uses the element name to determine the file extension.

  - 'Endevor type file extension only' method uses the Endevor defined file extension for the type.

  - (Default) 'Endevor type file extension or type name' method uses the Endevor defined file extension for the type. The method also uses the Endevor type name as a fall-back option.

- (Experimental) Workspace Synchronization. The option enables the Endevor Workspace initialization that lets you create a synchronized Endevor workspace locally.

  **Note:** Experimental features might include undiscovered errors. Please, use this feature at your own discretion.

Access the Explorer for Endevor settings by clicking **Settings** > **Extensions** > **Explorer for Endevor**.

## List of Limitations

This section lists notable limitations in the current version of Explorer for Endevor.

- Searching elements by comment and CCID is not supported.

  You can search using the instance, environment, stageNumber, system, subsystem, and type parameters.

- Only the UTF-8 character encoding is currently supported.

## Contribute to Explorer for Endevor

We encourage you to share ideas to help improve Explorer for Endevor. You can also report issues in the extension, using the following link.

> [Share an idea or open an issue in our Git repository](https://github.com/eclipse/che-che4z-explorer-for-endevor/issues)

## Eclipse Che4z

Explorer for Endevor is included with Eclipse Che version 7.6.0 and above. For more information, see the [Eclipse Che4z webpage](https://projects.eclipse.org/projects/ecd.che.che4z).

## Zowe Conformance Program

<a href="https://www.openmainframeproject.org/all-projects/zowe/conformance"><img src="https://www.openmainframeproject.org/wp-content/uploads/sites/11/2022/05/zowe-conformant-zowev2-explorer-color.png" 
alt="Zowe Conformance Badge" width="200" height="160"/></a>

Explorer for Endevor is Zowe V2 Conformant. The Zowe Conformance Program ensures a high level of common functionality, interoperability, and user experience while using an extension that leverages Zowe. For more information, see [Zowe Conformance Program](https://www.openmainframeproject.org/all-projects/zowe/conformance).

## Privacy Notice

The extensions for Visual Studio Code developed by Broadcom Inc., including its corporate affiliates and subsidiaries, ("Broadcom") are provided free of charge, but in order to better understand and meet its users’ needs, Broadcom may collect, use, analyze and retain anonymous users’ metadata and interaction data, (collectively, “Usage Data”) and aggregate such Usage Data with similar Usage Data of other Broadcom customers. Please find more detailed information in [License and Service Terms & Repository](https://www.broadcom.com/company/legal/licensing).

This data collection uses built-in Microsoft VS Code Telemetry, which can be disabled, at your sole discretion, if you do not want to send Usage Data.

The current release of Explorer for Endevor collects anonymous data for the following events:

- Extension commands, such as Add, Retrieve, Sign in, Sign out, Edit, Generate, etc.
- Build the tree view, refresh the tree view
- Filter elements
- Internal and Endevor errors

**Note**: Any sensitive information is filtered, so the extension gets only anonymous error messages and Endevor REST API error codes. The Endevor REST API error codes are collected for the purposes of determining errors in the extension lifecycle.

Each such event is logged with the following information:

- Event time
- Operating system and version
- Country or region
- Anonymous user and session ID
- Version numbers of Microsoft VS Code and Explorer for Endevor

## Technical Assistance and Support for Explorer for Endevor

The Explorer for Endevor extension is made available to customers on the Visual Studio Code Marketplace in accordance with the terms and conditions contained in the provided End-User License Agreement (EULA).

If you are on active support for Endevor, you get technical assistance and support in accordance with the terms, guidelines, details, and parameters that are located within the Broadcom [Working with Support](https://techdocs.broadcom.com/us/product-content/admin-content/ca-support-policies.html?intcmp=footernav) guide.

This support generally includes:

- Telephone and online access to technical support
- Ability to submit new incidents 24x7x365
- 24x7x365 continuous support for Severity 1 incidents
- 24x7x365 access to Broadcom Support
- Interactive remote diagnostic support

Technical support cases must be submitted to Broadcom in accordance with guidance provided in “Working with Support”.

Note: To receive technical assistance and support, you must remain compliant with “Working with Support”, be current on all applicable licensing and maintenance requirements, and maintain an environment in which all computer hardware, operating systems, and third party software associated with the affected Broadcom software are on the releases and version levels from the manufacturer that Broadcom designates as compatible with the software. Changes you elect to make to your operating environment could detrimentally affect the performance of Broadcom software and Broadcom shall not be responsible for these effects or any resulting degradation in performance of the Broadcom software. Severity 1 cases must be opened via telephone and elevations of lower severity incidents to Severity 1 status must be requested via telephone.

---

Copyright © 2022 Broadcom. The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
