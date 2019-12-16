pipeline {
    agent {
        docker {
            image 'node:alpine' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'chmod +x ./deployment/frontEnd.sh'
                sh './deployment/frontEnd.sh'
            }
        }
    }
}