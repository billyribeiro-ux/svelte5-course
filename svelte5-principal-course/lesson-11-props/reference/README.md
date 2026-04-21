# Lesson 11 reference — edge cases

Three standalone components isolating the subtler `$props()` patterns.

| File | What it shows | Why it matters |
|---|---|---|
| `RestSpreadForward.svelte` | `{...rest}` passing unknown attributes to the underlying element | The wrapper-component pattern every design-system uses. |
| `GenericList.svelte` | `<script lang="ts" generics="T">` for a typed list | Preserves the caller's data type through the component. The shape for typed tables, dropdowns, combobox. |
| `MutationWarning.svelte` | What happens when a child mutates vs reassigns prop state | Demonstrates the `ownership_invalid_mutation` path vs the clean callback-based one. |
