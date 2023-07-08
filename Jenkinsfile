/* Requires the Docker Pipeline plugin */
pipeline {
  agent { docker { image 'node:18.16.0-alpine' } }
  stages {
    stage('test') {
      steps {
        sh 'npm install && npm run lint'
      }
    }
  }
}
