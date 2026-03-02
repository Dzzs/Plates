import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
// export const runtime = 'edge'

export const size = {
    width: 180,
    height: 180,
}
export const contentType = 'image/png'

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: '#0a0a0b',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '22%', // Superellipse approximate
                    border: '10px solid #40C9FF',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        width: '160px',
                        height: '160px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '8px solid rgba(64, 201, 255, 0.2)',
                    }}
                >
                    <div
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: '#1a1a1b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '4px solid #40C9FF',
                        }}
                    >
                        <div
                            style={{
                                width: '15px',
                                height: '15px',
                                borderRadius: '50%',
                                background: '#000',
                            }}
                        />
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
