<script setup lang="ts">
const { isLoggedIn } = useUser()
</script>

<template>
    <div class="py-16">
        <section class="text-center">
            <p class="text-sm uppercase tracking-widest">Personal finance</p>
            <h1 class="mt-4 text-4xl sm:text-5xl font-extrabold">Finance tracker for real life</h1>
            <p class="mt-4 text-lg max-w-2xl mx-auto">
                Track income, expenses and trends in one place. Simple, fast, and private.
            </p>
            <div class="mt-8 flex items-center justify-center gap-4">
                <ClientOnly>
                    <template #fallback>
                        <UButton
                            to="/login"
                            label="Login"
                            size="xl"
                            color="neutral"
                        />
                    </template>
                    <UButton
                        v-if="isLoggedIn"
                        to="/dashboard"
                        label="Open dashboard"
                        size="xl"
                        color="neutral"
                    />
                    <UButton
                        v-else
                        to="/login"
                        label="Login"
                        size="xl"
                        color="neutral"
                    />
                </ClientOnly>
            </div>
        </section>

        <section class="mt-16 grid gap-6 sm:grid-cols-3">
            <div class="p-6 rounded-lg border border-gray-200 bg-white">
                <h3 class="font-semibold text-gray-900">Real-time overview</h3>
                <p class="mt-2 text-sm text-gray-600">
                    Instant totals and trends for the selected period.
                </p>
            </div>
            <div class="p-6 rounded-lg border border-gray-200 bg-white">
                <h3 class="font-semibold text-gray-900">Simple input</h3>
                <p class="mt-2 text-sm text-gray-600">
                    Add expenses in seconds with categories and notes.
                </p>
            </div>
            <div class="p-6 rounded-lg border border-gray-200 bg-white">
                <h3 class="font-semibold text-gray-900">Secure by default</h3>
                <p class="mt-2 text-sm text-gray-600">
                    Your data stays private and synced to your account.
                </p>
            </div>
        </section>
    </div>
</template>
