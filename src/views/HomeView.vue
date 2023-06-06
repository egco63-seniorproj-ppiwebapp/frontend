<template>
  <div class="container">
    <div>
      <input type="button" value="Hello!" />
      <input type="button" value="World!" class="primary" />
      <input type="button" value="Meow! -w-" class="secondary" />
      <input type="button" value="Hello!" disabled />
      <input type="button" value="World!" class="primary" disabled />
      <input type="button" value="Meow! -w-" class="secondary" disabled />
    </div>
    <div>
      <input type="button" value="Outline A" class="outline" />
      <input type="button" value="Outline B" class="outline primary" />
      <input type="button" value="Outline C" class="outline secondary" />
      <input type="button" value="Link" class="link" />
      <input type="button" value="Outline A" class="outline" disabled />
      <input type="button" value="Outline B" class="outline primary" disabled />
      <input
        type="button"
        value="Outline C"
        class="outline secondary"
        disabled
      />
      <input type="button" value="Link" class="link" disabled />
    </div>
    <div>
      <input
        type="text"
        placeholder="Username"
        name="username"
        autocomplete="username"
      />
      <input type="password" placeholder="Password" name="password" />
    </div>
    <div>
      <textarea cols="30" rows="10" name="text0"></textarea>
    </div>
    <div>
      <CheckBox label="Hello" />
      <CheckBox label="What's up!" />
      <CheckBox label="Nice~" />
    </div>
    <div>
      <RadioButton label="Wow!" group="00" />
      <RadioButton label="Cool!!" group="00" />
      <RadioButton label="Ehe~ ;3" group="00" />
    </div>
  </div>
</template>

<style lang="sass" scoped>
div
  padding: 1.5rem
</style>

<script lang="ts">
import { defineComponent } from "vue";
import CheckBox from "@/components/CheckBox.vue";
import RadioButton from "@/components/RadioButton.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    CheckBox,
    RadioButton,
  },
});
</script>
