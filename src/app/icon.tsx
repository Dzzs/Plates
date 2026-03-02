import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
// export const runtime = 'edge'

export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse render element
            <div
                style={{
                    background: '#0a0a0b',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    border: '2px solid #40C9FF',
                    position: 'relative',
                }}
            >
                {/* Hub */}
                <div
                    style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#1a1a1b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #40C9FF',
                    }}
                >
                    {/* Hole */}
                    <div
                        style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: '#000',
                        }}
                    />
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
