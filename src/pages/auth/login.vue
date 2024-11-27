<route>
  {
      meta: {
      layout: "auth",
      title: "Login",
      }
  }
  </route>

<script setup lang="ts">
import type { CallbackTypes } from 'vue3-google-login'
import { toast } from '@/components/ui/toast'
import { useAuthStore } from '@/stores/auth'
import { loginValidator } from '@/utils/validation'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { RouterLink } from 'vue-router'
import { googleTokenLogin } from 'vue3-google-login'

const authStore = useAuthStore()

const form = useForm({
  validationSchema: toTypedSchema(loginValidator),
})
const isLoading = ref(false)
const onSubmit = form.handleSubmit(async (values) => {
  try {
    isLoading.value = true
    await authStore.login(values)
  }
  catch (error: Error | any) {
    const data = error?.response?.data
    const errorMessage = data?.error || data?.message[0]?.message || data?.message || 'Some thing went wrong'
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
      duration: 5000,
    })
  }
  finally {
    isLoading.value = false
  }
})
const callback: CallbackTypes.TokenResponseCallback = async (response) => {
  try {
    isLoading.value = true
    await authStore.loginWithGoogle(response.access_token)
  }
  catch {
    toast({
      title: 'Error',
      description: 'Some thing went wrong',
      variant: 'destructive',
      duration: 5000,
    })
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form class="rounded-lg border bg-card text-card-foreground shadow-sm mx-auto max-w-sm h-max sm:min-w-[25rem]" @submit.prevent="onSubmit">
    <CardHeader>
      <CardTitle class="text-2xl text-center">
        Login
      </CardTitle>
      <CardDescription class="text-center">
        Enter your email below to login to your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid">
          <InputValidator id="email" type="email" label="Email" placeholder="m@gmai.com" name="email" />
          <div class="grid gap-2">
            <InputValidator id="password" type="password" placeholder="Password" label="Password" name="password" />
            <RouterLink to="/auth/forgot-password" class="ml-auto text-sm underline">
              Forgot your password?
            </RouterLink>
          </div>
        </div>
        <Button type="submit" :disabled="isLoading" class="ml-4">
          <template v-if="isLoading">
            <Icon name="IconLoading" />
            Please wait
          </template>
          <template v-else>
            Login
          </template>
        </Button>
      </div>
      <div class="mt-4 text-center text-sm">
        Don't have an account?
        <RouterLink to="/auth/signup" class="underline">
          Sign up
        </RouterLink>
      </div>
      <Separator label="Or" style-label="bg-transparent" class="my-4" />
      <GoogleLogin :callback="callback" class="w-full" popup-type="TOKEN">
        <Button type="button" class="w-full">
          <Icon name="IconGoogle" class="w-8 h-8" />
          Login with Google
        </Button>
      </GoogleLogin>
    </CardContent>
  </form>
</template>
