import { useAppKit } from '@reown/appkit/react'
import Button from './Button'

export default function ConnectButton({ loading = false, title }) {
  // 4. Use modal hook
  const { open } = useAppKit()

  return (
    <>
      {/* <button onClick={() => open({ view: 'Networks' })}>Open Network Modal</button> */}
      <Button
        title={title}
        onClick={() => open()}
        loading={loading}
      />
    </>

  )
}

