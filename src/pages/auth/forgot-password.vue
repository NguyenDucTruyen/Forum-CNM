<route>
    {
        meta: {
        layout: "auth",
        title: "Forgot Password",
        }
    }
</route>

<script setup lang="ts">
import { toast } from '@/components/ui/toast'
import { useAuthStore } from '@/stores/auth'
import { emailValidator } from '@/utils/validation'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

const router = useRouter()

const authStore = useAuthStore()

const form = useForm({
  validationSchema: toTypedSchema(emailValidator),
})
const isLoading = ref(false)
const onSubmit = form.handleSubmit(async (values) => {
  try {
    isLoading.value = true
    await authStore.sendEmailResetPassword(values)
    isLoading.value = false
    toast({
      title: 'Success',
      description: 'Email sent successfully, check your inbox',
    })
    router.push(`/auth/reset-password?email=${values.email}`)
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
  <form class="sm:min-w-[25rem]" @submit.prevent="onSubmit">
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl text-center">
          Forgot Password
        </CardTitle>
        <CardDescription class="text-center">
          Enter your email below to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <InputValidator id="email" type="email" label="Email" placeholder="m@gmai.com" name="email" />
          </div>
          <Button type="submit" :disabled="isLoading" class="ml-4">
            <template v-if="isLoading">
              <Icon name="IconLoading" />
              Please wait
            </template>
            <template v-else>
              Send Email
            </template>
          </Button>
        </div>
        <div class="mt-4 text-center text-sm">
          <RouterLink to="/auth/login" class="underline">
            Back to login
          </RouterLink>
        </div>
      </CardContent>
    </Card>
  </form>
</template>
