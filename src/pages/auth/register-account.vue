<route>
    {
        meta: {
            title: "Sign Up",
            layout: "auth",
        }
    }
  </route>

<script setup lang="ts">
import { toast } from '@/components/ui/toast'
import { useAuthStore } from '@/stores/auth'
import { signupValidator } from '@/utils/validation'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

if (!route.query.email) {
  router.push('/auth/signup')
}

const form = useForm({
  validationSchema: toTypedSchema(signupValidator),
})

const isLoading = ref(false)
const onSubmit = form.handleSubmit(async (values) => {
  try {
    await authStore.register(values)
    toast({
      title: 'Success',
      description: 'Account created successfully',
    })
    router.push('/auth/login')
  }
  catch (error: Error | any) {
     const data = error?.response?.data
    const errorMessage = data?.error || data?.message || 'Some thing went wrong'
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
</script>

<template>
  <form class="rounded-lg border bg-card text-card-foreground shadow-sm mx-auto max-w-sm sm:min-w-[25rem] h-max" @submit.prevent="onSubmit">
    <CardHeader>
      <CardTitle class="text-2xl text-center">
        Sign Up
      </CardTitle>
      <CardDescription class="text-center">
        Enter your information to create an account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid">
        <InputValidator
          id="email"
          :model-value="route.query.email"
          type="email"
          label="Email"
          placeholder="m@example.com"
          disabled
          name="email"
        />
        <InputValidator id="otp" label="OTP" placeholder="123456" type="text" name="otp" />
        <InputValidator id="password" label="Password" placeholder="Password" type="password" name="password" />
        <InputValidator id="confirmPassword" label="Confirm password" placeholder="Confirm Password" type="password" name="confirmPassword" />

        <Button type="submit" :disabled="isLoading" class="ml-4">
          <template v-if="isLoading">
            <Icon name="IconLoading" />
            Please wait
          </template>
          <template v-else>
            Create an account
          </template>
        </Button>
      </div>
      <div class="mt-4 text-center text-sm">
        Already have an account?
        <RouterLink to="/auth/login" class="ml-1 text-balance underline">
          Login
        </RouterLink>
      </div>
    </CardContent>
  </form>
</template>
