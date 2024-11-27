<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FooterSection',
})
</script>

<template>
  <div class="main sm:px-4  bg-muted">
    <div
      class="container flex flex-col justify-between py-10 mx-auto lg:flex-row"
    >
      <div
        class="grid grid-cols-2 text-sm gap-x-3 gap-y-8 w-full sm:grid-cols-4"
      >
        <div class="col-span-2 flex flex-col justify-center items-center">
          <a
            rel="noopener noreferrer"
            class="flex justify-center space-x-3 lg:justify-start gap-[14px] mb-[20px]"
          >
            <div
              class="flex items-center justify-center w-12 h-12 rounded-full"
            >
              <Icon name="IconLogo" class="w-20 h-20" />

            </div>
          </a>
          <h3 class="uppercase text-center text-primary">
            Sgroup
          </h3>
          <h3 class="uppercase text-center text-primary">
            Think different - Make different
          </h3>
        </div>
        <div class="space-y-3">
          <h3 class="uppercase text-foreground">
            Specialization
          </h3>
          <ul class="space-y-1 text-foreground">
            <li class="py-[4px]">
              <a rel="noopener noreferrer" href="#">Programming </a>
            </li>
            <li class="py-[4px]">
              <a rel="noopener noreferrer" href="#">Online marketing</a>
            </li>
            <li class="py-[4px]">
              <a rel="noopener noreferrer" href="#">Design </a>
            </li>
          </ul>
        </div>
        <div class="space-y-3">
          <h3 class="uppercase text-foreground">
            Social Media
          </h3>
          <ul class="space-y-1 text-foreground">
            <li>
              <a
                rel="noopener noreferrer"
                href="https://www.facebook.com/sgroupvn.org"
                title="Facebook"
                target="_blank"
                class="flex items-center p-1"
              >
                <Icon
                  name="IconFacebook"
                  class="w-[20px] h-[20px]"
                  alt="Facebook"
                />
                <span class="ml-[8px]">Facebook</span>
              </a>
            </li>
            <li>
              <a
                rel="noopener noreferrer"
                href="https://www.linkedin.com/company/sgroupvn"
                target="_blank"
                title="Linkedin"
                class="flex items-center p-1"
              >
                <Icon
                  name="IconLinkedIn"
                  class="w-[20px] h-[20px]"
                  alt="LinkedIn"
                />
                <span class="ml-[8px]">LinkedIn</span>
              </a>
            </li>
            <li>
              <a
                rel="noopener noreferrer"
                href="https://sgroupvn.org/"
                target="_blank"
                title="Website"
                class="flex items-center p-1"
              >
                <Icon
                  name="IconWebsite"
                  class="w-[20px] h-[20px]"
                  alt="Website"
                />
                <span class="ml-[8px]">Website</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="py-6 text-sm text-center text-foreground">
      © 2024 S-Forum. All rights reserved.
    </div>
  </div>
</template>

  <style lang="scss" scoped>
.main {
    .container {
      .name {
        color: var(--primary);
        font-size: 26px;
        font-style: normal;
        font-weight: 700;
        line-height: 38px;
        font-family: 'Montserrat', sans-serif;
      }
    }
  }
  </style>
