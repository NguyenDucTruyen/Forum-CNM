<route>
    {
        meta: {
        layout: "auth",
        title: "Reset Password",
        }
    }
</route>

<script setup lang="ts">
import { toast } from '@/components/ui/toast'
import { useAuthStore } from '@/stores/auth'
import { resetPasswordValidator } from '@/utils/validation'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

const router = useRouter()
const authStore = useAuthStore()

const form = useForm({
  validationSchema: toTypedSchema(resetPasswordValidator),
})
const isLoading = ref(false)
const onSubmit = form.handleSubmit(async (values) => {
  try {
    await authStore.resetPassword(values)
    toast({
      title: 'Success',
      description: 'Password reset successfully',
    })
    router.push('/auth/login')
  }
  catch (error: Error | any) {
    const data = error?.response?.data
    const errorMessage = Array.isArray(data?.message) ? data.message[0]?.message : data?.message || data?.error || 'Some thing went wrong'
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
  <form class="rounded-lg border bg-card text-card-foreground shadow-sm mx-auto max-w-sm h-max w-[20rem] sm:min-w-[25rem]" @submit.prevent="onSubmit">
    <CardHeader>
      <CardTitle class="text-2xl text-center">
        Reset Password
      </CardTitle>
      <CardDescription class="text-center">
        Enter your token and new password
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="">
        <InputValidator
          id="token"
          type="text"
          label="Token reset password"
          placeholder="Token reset password"
          name="token"
          autocomplete="off"
        />
        <InputValidator id="password" label="Password" placeholder="Password" type="password" name="password" />
        <InputValidator id="confirmPassword" label="Confirm password" placeholder="Confirm Password" type="password" name="confirmPassword" />
        <Button type="submit" :disabled="isLoading" class="ml-4">
          <template v-if="isLoading">
            <Icon name="IconLoading" />
            Please wait
          </template>
          <template v-else>
            Reset Password
          </template>
        </Button>
      </div>
      <div class="mt-4 text-center text-sm">
        <RouterLink to="/auth/login" class="underline">
          Back to login
        </RouterLink>
      </div>
    </CardContent>
  </form>
</template>
