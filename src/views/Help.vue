<template>
	<div class="bg-gray-50 p-4 sm:p-6 lg:p-8">
		<div class="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
			<h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Help</h1>
			<p class="text-sm text-gray-600 mb-6">
				Quick guide to NFC tags and service requests in SureBox.
			</p>

			<section class="mb-8">
				<h2 class="text-lg font-semibold text-gray-900 mb-2">NFC tags</h2>
				<ul class="list-disc pl-5 text-sm text-gray-700 space-y-2">
					<li>Register a tag from <strong>Register NFC Tag</strong> or <strong>My NFC Tags</strong>.</li>
					<li>Keep each tag’s nickname and address up to date so technicians can find the location.</li>
					<li>You can activate or deactivate a tag when you no longer want it used for requests.</li>
				</ul>
			</section>

			<section class="mb-8">
				<h2 class="text-lg font-semibold text-gray-900 mb-2">Service requests</h2>
				<ul class="list-disc pl-5 text-sm text-gray-700 space-y-2">
					<li>Create a request from the catalog or your dashboard; pick the service and NFC location (or enter an address).</li>
					<li>Track status under <strong>My Requests</strong> — you’ll see quotes and progress there.</li>
				</ul>
			</section>

			<p class="text-xs text-gray-500">
				Need account access? Sign in or contact your company administrator.
			</p>

			<div class="mt-8 pt-6 border-t border-gray-200">
				<router-link
					to="/"
					class="text-sm font-medium text-[#0D65AE] hover:underline"
				>
					← Back to home
				</router-link>
			</div>
		</div>
	</div>
</template>

<script setup>
</script>
