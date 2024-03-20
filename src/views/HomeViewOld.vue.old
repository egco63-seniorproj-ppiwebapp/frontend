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
    <div>
      <select name="myselect" @change="selectChoice">
        <option value="a">Ant</option>
        <option value="b">Bird</option>
        <option value="c">Cat</option>
        <option value="d">Dog</option>
        <option value="e">Elephant</option>
        <option value="f">Fish</option>
        <option value="g">Goat</option>
        <option value="h">Hippopotamus</option>
        <option value="i">Imp</option>
      </select>
    </div>
    <div>
      <ModalDisplay class="primary" title="Hello there!" btn-value="Open modal">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc elit
          sapien, commodo vel aliquet nec, maximus non tortor. Cras luctus ut
          massa ut sollicitudin. Curabitur nec augue felis. Aliquam facilisis
          arcu id hendrerit imperdiet. Sed ornare ut ipsum efficitur consequat.
          Nulla et molestie sem. Quisque elementum felis consequat sem mollis
          eleifend. Praesent fermentum vehicula egestas. Suspendisse tempus odio
          nec ipsum fermentum feugiat. Maecenas ipsum lectus, sollicitudin a
          condimentum ut, maximus et enim.
        </p>
        <p>
          Sed commodo lorem arcu, eget lobortis neque rutrum ac. Etiam eu dui
          porttitor justo efficitur maximus non quis eros. Nunc tristique, urna
          nec pharetra cursus, ex lorem varius purus, eu malesuada est massa
          tincidunt velit. Quisque eu ullamcorper leo. Sed sed ante urna. Sed
          egestas massa urna, fermentum varius eros viverra vel. Nullam
          fermentum finibus lectus eu finibus. Vivamus dapibus libero sagittis
          ex tristique cursus. Proin a est nec metus cursus dictum.
        </p>
        <p>
          Sed commodo lorem arcu, eget lobortis neque rutrum ac. Etiam eu dui
          porttitor justo efficitur maximus non quis eros. Nunc tristique, urna
          nec pharetra cursus, ex lorem varius purus, eu malesuada est massa
          tincidunt velit. Quisque eu ullamcorper leo. Sed sed ante urna. Sed
          egestas massa urna, fermentum varius eros viverra vel. Nullam
          fermentum finibus lectus eu finibus. Vivamus dapibus libero sagittis
          ex tristique cursus. Proin a est nec metus cursus dictum.
        </p>
        <p>
          Sed commodo lorem arcu, eget lobortis neque rutrum ac. Etiam eu dui
          porttitor justo efficitur maximus non quis eros. Nunc tristique, urna
          nec pharetra cursus, ex lorem varius purus, eu malesuada est massa
          tincidunt velit. Quisque eu ullamcorper leo. Sed sed ante urna. Sed
          egestas massa urna, fermentum varius eros viverra vel. Nullam
          fermentum finibus lectus eu finibus. Vivamus dapibus libero sagittis
          ex tristique cursus. Proin a est nec metus cursus dictum.
        </p>
        <p>
          Sed commodo lorem arcu, eget lobortis neque rutrum ac. Etiam eu dui
          porttitor justo efficitur maximus non quis eros. Nunc tristique, urna
          nec pharetra cursus, ex lorem varius purus, eu malesuada est massa
          tincidunt velit. Quisque eu ullamcorper leo. Sed sed ante urna. Sed
          egestas massa urna, fermentum varius eros viverra vel. Nullam
          fermentum finibus lectus eu finibus. Vivamus dapibus libero sagittis
          ex tristique cursus. Proin a est nec metus cursus dictum.
        </p>
        <p>
          Sed commodo lorem arcu, eget lobortis neque rutrum ac. Etiam eu dui
          porttitor justo efficitur maximus non quis eros. Nunc tristique, urna
          nec pharetra cursus, ex lorem varius purus, eu malesuada est massa
          tincidunt velit. Quisque eu ullamcorper leo. Sed sed ante urna. Sed
          egestas massa urna, fermentum varius eros viverra vel. Nullam
          fermentum finibus lectus eu finibus. Vivamus dapibus libero sagittis
          ex tristique cursus. Proin a est nec metus cursus dictum.
        </p>
      </ModalDisplay>
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
import ModalDisplay from "@/components/ModalDisplay.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    CheckBox,
    RadioButton,
    ModalDisplay,
  },
  methods: {
    selectChoice(e: Event) {
      console.log((e.target as HTMLSelectElement).value);
    },
  },
});
</script>
