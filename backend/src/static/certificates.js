document.addEventListener('DOMContentLoaded', async () => {
    const certificatesContainer = document.getElementById('certificates-container');
    const noCertificatesMessage = document.getElementById('no-certificates-message');

    // Função para buscar e exibir os certificados do usuário
    async function fetchAndDisplayCertificates() {
        try {
            const response = await fetch('/api/my_certificates', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                // Usuário não logado, redirecionar para a página de login
                window.location.href = 'login.html';
                return;
            }

            const certificates = await response.json();

            if (certificates.length === 0) {
                noCertificatesMessage.style.display = 'block';
                certificatesContainer.innerHTML = '';
                return;
            }

            noCertificatesMessage.style.display = 'none';
            certificatesContainer.innerHTML = ''; // Limpa o container antes de adicionar

            for (const certData of certificates) {
                // Buscar detalhes do curso para exibir no certificado
                const courseResponse = await fetch(`/api/courses/${certData.course_id}`);
                const course = await courseResponse.json();

                const certificateCard = document.createElement('div');
                certificateCard.classList.add('certificate-card', 'reveal');
                certificateCard.innerHTML = `
                    <div class="certificate-icon"><i class="fas fa-award"></i></div>
                    <h3>${course.title}</h3>
                    <p><strong>Emitido em:</strong> ${new Date(certData.issue_date).toLocaleDateString()}</p>
                    <p><strong>Código:</strong> ${certData.certificate_code}</p>
                    <div class="certificate-actions">
                        <button class="btn btn-primary download-btn" data-certificate-id="${certData.id}">
                            <i class="fas fa-download"></i> Baixar PDF
                        </button>
                        <button class="btn btn-outline view-btn" data-certificate-id="${certData.id}">
                            <i class="fas fa-eye"></i> Visualizar
                        </button>
                    </div>
                `;
                certificatesContainer.appendChild(certificateCard);
            }

            // Adicionar listeners para os botões de download
            certificatesContainer.querySelectorAll('.download-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const certificateId = e.currentTarget.dataset.certificateId;
                    try {
                        const downloadResponse = await fetch(`/api/certificates/${certificateId}/download`);
                        const data = await downloadResponse.json();
                        if (downloadResponse.ok) {
                            // Abre o PDF em uma nova aba para download/visualização
                            window.open(data.download_url, '_blank');
                        } else {
                            alert(data.message || 'Erro ao baixar certificado.');
                        }
                    } catch (error) {
                        console.error('Erro ao baixar certificado:', error);
                        alert('Erro de conexão ao tentar baixar o certificado.');
                    }
                });
            });

            // Adicionar listeners para os botões de visualizar (pode ser o mesmo que download por enquanto)
            certificatesContainer.querySelectorAll('.view-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const certificateId = e.currentTarget.dataset.certificateId;
                    try {
                        const viewResponse = await fetch(`/api/certificates/${certificateId}/download`);
                        const data = await viewResponse.json();
                        if (viewResponse.ok) {
                            window.open(data.download_url, '_blank');
                        } else {
                            alert(data.message || 'Erro ao visualizar certificado.');
                        }
                    } catch (error) {
                        console.error('Erro ao visualizar certificado:', error);
                        alert('Erro de conexão ao tentar visualizar o certificado.');
                    }
                });
            });

        } catch (error) {
            console.error('Erro ao buscar certificados:', error);
            noCertificatesMessage.style.display = 'block';
            noCertificatesMessage.textContent = 'Erro ao carregar seus certificados. Tente novamente mais tarde.';
        }
    }

    fetchAndDisplayCertificates();
});


