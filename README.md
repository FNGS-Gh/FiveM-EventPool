# FiveM-EventPool
`by Ghost @ FNGS / 2026` → [Author's GitHub](https://github.com/GhostQck) / [Publish Github](https://github.com/FNGS-Gh)

This script is more of a showcase implementation. It is completely standalone and might be useful only during the development process. The script periodically (every `100ms`) checks a set of player states and triggers a corresponding custom client event if the state mutates. For optimization and standard production purposes, it is best to strip away any excessive events and use only those that cause any reaction in 2 or more resources.

*More details can be found below under the* **"2. Description"** *section ▼*

## 1. Installation
❗️ *This project is published under the MIT License. Upon using it, please make sure to keep the credits and apply the same type of licensing.*

---

###
If you don't care about the code readability and you just want to deploy the resource straight away, you can delete everything except of the following files and folders (and their content respectively):

```
fxmanifest.lua
config.json
dist/
```

The `config.json` file can be modified anytime with no need to rebuild the scripts.

---

###
If you want to modify the code, you'll find the source TypeScript files within the `src/` folder. Please note that this repo doesn't contain any TS builder and etc, so you'll need to set up your dev environment accordingly.

Also make sure that you have the `@citizenfx` packages:

```
npm install -D typescript @citizenfx/client @citizenfx/server
```

## 2. Description

### Movement Events:

| Event Name | Trigger | Return Value (if any) |
| ---------- | ---------- | ---------- |
| **Movement:Still** | Player Ped stands still or starts moving | `true` or `false` |
| **Movement:Walking** | Player Ped starts or stops walking | `true` or `false` | 
| **Movement:Running** | Player Ped starts or stops running | `true` or `false` |
| **Movement:Sprinting** | Player Ped starts or stops running via the Shift key | `true` or `false` |
| **Movement:Moving** | Player Ped starts or stops moving (defined by coords) | `true` or `false` |
| **Movement:Stealth** | Player Ped enters or leaves "stealth" movement | `true` or `false` |
| **Movement:Ragdoll** | Player Ped enters or leaves ragdoll state | `true` or `false` |
| **Movement:OnStairs** | Player Ped starts or stops walking on the stairs | `true` or `false` |
| **Movement:InWater** | Player Ped starts or stops swimming | `true` or `false` |
| **Movement:Underwater** | Player Ped starts or stops diving underwater | `true` or `false` |
| **Movement:Drowning** | Player starts or stops drowning (defined by remaining breath) | `true` or `false` |
| **Movement:InAir** | Player Ped sets up in the air or gets down on the ground | `true` or `false` |
| **Movement:Jumping** | Player Ped starts or stops jumping | `true` or `false` |
| **Movement:Falling** | Player Ped starts or stops falling | `true` or `false` |
| **Movement:Climbing** | Player Ped starts or stops climbing a ladder | `true` or `false` |

### Vehicle Events:

| Event Name | Trigger | Return Value (if any) |
| ---------- | ---------- | ---------- |
| **Vehicle:InVehicle** | Player Ped is fully seated in any vehicle | `true` or `false`; last vehicle `Entity ID` |
| **Vehicle:Entering** | Player Ped starts or stops entering any vehicle | `true` or `false`; last vehicle `Entity ID` |
| **Vehicle:Exiting** | Player Ped starts or stops leaving any vehicle | `true` or `false`; last vehicle `Entity ID` |
| **Vehicle:UseVehicle** | Player Ped starts or stops driving/sitting/entering/leaving any vehicle | `true` or `false`; last vehicle `Entity ID` |
| **Vehicle:Moving** | Vehicle Player Ped is occupying starts or stops moving (defined by its coords) | `true` or `false`; last vehicle `Entity ID` |
| **Vehicle:Driver** | Player Ped starts or stops sitting in a driver seat | `true` or `false`; last vehicle `Entity ID` |
| **Vehicle:InAir** | Vehicle Player Ped is occupying sets up in the air or gets down on the ground | `true` or `false`; last vehicle `Entity ID` |
| **Vehicle:OnRoof** | Vehicle Player Ped is occupying starts or stops laying on its roof | `true` or `false`; last vehicle `Entity ID` |
| **Vehicle:Offroad** | Vehicle Player Ped is occupying enters or leaves an offroad area (defined by its drivetrain) | `true` or `false`; last vehicle `Entity ID` |
| **Vehicle:Crashed** | Vehicle Player Ped is occupying starts or stops colliding with anything | `true` or `false`; last vehicle `Entity ID` |

### Weapon Events:

| Event Name | Trigger | Return Value (if any) |
| ---------- | ---------- | ---------- |
| **Weapon:UseFirearm** | Player Ped starts or stops handling any firearm | `true` or `false`; last weapon hash |
| **Weapon:UseMelee** | Player Ped starts or stops handling any melee weapon (except of `WEAPON_UNARMED`) | `true` or `false`; last weapon hash |
| **Weapon:UseThrow** | Player Ped starts or stops handling any throwable/explosive weapon | `true` or `false`; last weapon hash |
| **Weapon:UseWeapon** | Player Ped starts or stops handling any weapon (except of `WEAPON_UNARMED`) | `true` or `false`; last weapon hash |
| **Weapon:Aiming** | Player starts or stops aiming | `true` or `false`; last weapon hash |
| **Weapon:Rolling** | Player Ped starts or stops performing a tactical roll | `true` or `false`; last weapon hash |
| **Weapon:Shooting** | Player Ped starts or stops shooting with any weapon | `true` or `false`; last weapon hash |
| **Weapon:Switching** | Player Ped starts or stops swapping weapons | `true` or `false` |

## 3. Known Issues

*None at the moment*