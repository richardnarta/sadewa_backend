function generateForgetPasswordOTPHTML(recipient, otp) {
  return `
  <div style="margin: 0 auto; width: 100%; max-width: 600px; 
    padding-bottom: 10px; border-radius: 5px; line-height: 1.8;">
    <strong>Kepada ${recipient},</strong>
    <p>
      Kami menerima permintaan pergantian password pada akun anda. 
      Demi keamanan akun, kami mengirimkan kode One-Time Password (OTP) 
      yang dapat digunakan untuk mengubah password anda.
      <br />
      <b>Kode One-Time Password (OTP) anda adalah:</b>
    </p>
    <h2 style="background: linear-gradient(to right, #00bc69 0, #00bc88 50%, #00bca8 100%);
    margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">
    ${otp}</h2>
    <p style="font-size: 0.9em">
      <strong>One-Time Password (OTP) hanya berlaku selama 5 menit.</strong>
      <br />
      <br />
      Jika anda merasa tidak melakukan aktifitas ini, silahkan abaikan pesan ini.
      <br />
      <strong>Mohon untuk tidak membagikan kode OTP ini kepada siapapun.</strong>
      <br />
      <br />
      <strong>Anda tidak perlu membalas pesan ini.</strong>
      <br />
      <br />
      Salam,
      <br />
      <strong>Tambak Udang Sadewa Farm</strong>
    </p>
  </div>
  
  `
}

function generateEmailVerificationOTPHTML(recipient, otp) {
  return `
  <div style="margin: 0 auto; width: 100%; max-width: 600px; 
    padding-bottom: 10px; border-radius: 5px; line-height: 1.8;">
    <strong>Kepada ${recipient},</strong>
    <p>
      Terima kasih telah membuat akun di Tambak Udang Sadewa Farm. 
      Untuk menyelesaikan proses pendaftaran dan mengaktifkan akun anda, 
      kami mengirimkan kode One-Time Password (OTP) yang dapat digunakan 
      untuk verifikasi.
      <br />
      <b>Kode One-Time Password (OTP) anda adalah:</b>
    </p>
    <h2 style="background: linear-gradient(to right, #00bc69 0, #00bc88 50%, #00bca8 100%);
    margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">
    ${otp}</h2>
    <p style="font-size: 0.9em">
      <strong>One-Time Password (OTP) hanya berlaku selama 5 menit.</strong>
      <br />
      <br />
      Jika anda merasa tidak melakukan aktifitas ini, silahkan abaikan pesan ini.
      <br />
      <strong>Mohon untuk tidak membagikan kode OTP ini kepada siapapun.</strong>
      <br />
      <br />
      <strong>Anda tidak perlu membalas pesan ini.</strong>
      <br />
      <br />
      Salam,
      <br />
      <strong>Tambak Udang Sadewa Farm</strong>
    </p>
  </div>
  
  `
}

module.exports = {
  generateForgetPasswordOTPHTML,
  generateEmailVerificationOTPHTML,
};