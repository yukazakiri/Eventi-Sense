import { useState, useEffect } from 'react';
import supabase from '../../../api/supabaseClient';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa';

interface SupplierSocialMedia {
    id?: string;
    supplier_id: string;
    platform: string;
    link: string;
    created_at?: string;
}

interface SocialMediaLinksProps {
    supplierId: string;
}

function PublicSocialMediaLinks({ supplierId }: SocialMediaLinksProps) {
    const [socialMedia, setSocialMedia] = useState<SupplierSocialMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLinks = async () => {
            if (!supplierId) {
                setError('Supplier ID is missing.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const { data, error } = await supabase
                    .from('supplier_social_media')
                    .select('*')
                    .eq('supplier_id', supplierId);

                if (error) {
                    setError('Error fetching social media links.');
                    console.error('Error fetching links:', error);
                } else {
                    setSocialMedia(data);
                }
            } catch (err) {
                setError('An unexpected error occurred.');
                console.error('Error fetching links:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, [supplierId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="flex space-x-4">
            {socialMedia.map((link) => (
                <a
                    key={link.id}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-75 transition-opacity "
                >
                    {link.platform.toLowerCase() === 'facebook' && (
                    <div className='rounded-full border-[1px] border-gray-300 p-2'>
                        <FaFacebook className="text-blue-1 text-3xl" />
                    </div>
                    )}
                    {link.platform.toLowerCase() === 'twitter' && (
                    <div className='rounded-full border-[1px] border-gray-300 p-2'>
                        <FaTwitter className="text-blue-1 text-3xl" />
                     </div>
                    )}
                    {link.platform.toLowerCase() === 'instagram' && (
                    <div className='rounded-full border-[1px] border-gray-300 p-2'>
                        <FaInstagram className="text-pink-700 text-3xl" />
                    </div>
                    )}
                    {link.platform.toLowerCase() === 'linkedin' && (
                    <div className='rounded-full border-[1px] border-gray-300 p-2'>
                        <FaLinkedin className="text-blue-1 text-3xl" />
                    </div>
                    )}
                    {link.platform.toLowerCase() === 'tiktok' && (
                    <div className='rounded-full border-[1px] border-gray-300 p-2'>
                        <FaTiktok className="text-black text-3xl" />
                    </div>
                    )}
                </a>
            ))}
        </div>
    );
}

export default PublicSocialMediaLinks;