<route>
  {
      meta: {
          title: 'Change Password',
          layout: 'profile'
      }
  }
</route>

<script setup lang="ts">
import { toast } from '@/components/ui/toast'
import { useUserStore } from '@/stores/user'
import { changePasswordValidator } from '@/utils/validation'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

const userStore = useUserStore()

const form = useForm({
  validationSchema: toTypedSchema(changePasswordValidator),
})
const isLoading = ref(false)
const onSubmit = form.handleSubmit(async (values) => {
  try {
    await userStore.changePassword(values)
    toast({
      title: 'Success',
      description: 'Password changed successfully.',
    })
    form.resetForm()
  }
  catch (error: Error | any) {
    const data = error?.response?.data
    const errorMessage = data?.error || 'Some thing went wrong'
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
  <form class="rounded-lg border bg-card text-card-foreground shadow-sm mx-auto h-max w-full" @submit.prevent="onSubmit">
    <CardHeader>
      <CardTitle class="text-2xl text-center">
        Change Password
      </CardTitle>
      <CardDescription class="text-center">
        Please enter your new password
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="">
        <InputValidator id="password" label="Password" placeholder="Password" type="password" name="password" />
        <InputValidator id="newPassword" label="New Password" placeholder="Enter New Password" type="password" name="newPassword" />
        <InputValidator id="confirmNewPassword" label="Confirm New password" placeholder="Confirm New Password" type="password" name="confirmNewPassword" />
        <Button type="submit" :disabled="isLoading" class="ml-4">
          <template v-if="isLoading">
            <Icon name="IconLoading" />
            Please wait
          </template>
          <template v-else>
            Change Password
          </template>
        </Button>
      </div>
    </CardContent>
  </form>
</template>
