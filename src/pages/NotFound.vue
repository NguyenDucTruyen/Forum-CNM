<route>
    {
        meta: {
            title: '404 Not Found',
            layout: 'auth'
        }
    }
</route>

<template>
  <div class="error-page">
    <h1>Page not found.</h1>
    <p>
      The page you are looking for does not exist.
    </p>
    <router-link to="/home">
      <Button>
        Go Back
      </Button>
    </router-link>
  </div>
</template>

  <style>
  .error-page {
    text-align: center;
    margin-top: 100px;
  }
  </style>
