import JSEncrypt from 'jsencrypt/bin/jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCCZAxB1HvYHR6KbYUyGtTeSyVKK7K3Uoou4O3\n' +
'Dd/oXju3eLCo/HRZ08bMkNj8XzVOVgUiIDqMvukVt0XMlvyzXjz3sqjoST6IvWlBMyGa4B+0Kd8hqtu1frXb1FUYCmIq1\n' +
'gNmLfDseEAENsQ5S3+86Mnj5oMelEC6Vz4ZJsdtFDQIDAQAB'

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}
