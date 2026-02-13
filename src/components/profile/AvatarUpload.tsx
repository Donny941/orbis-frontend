import { useState, useRef } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { cloudinaryService } from "../../services/cloudinaryService";
import { useAppDispatch } from "../../store/hooks";
import { updateProfileThunk } from "../../store/slices/authThunks";
import { orbisToast } from "../../services/orbisToast";
import { getInitials } from "../../utils/helpers";

interface AvatarUploadProps {
  currentImage?: string | null;
  displayName: string;
}

export const AvatarUpload = ({ currentImage, displayName }: AvatarUploadProps) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      setIsUploading(true);

      // Upload to Cloudinary
      const imageUrl = await cloudinaryService.uploadImage(file);

      // Save URL to backend
      await dispatch(updateProfileThunk({ profilePicture: imageUrl })).unwrap();

      orbisToast.success("Profile picture updated!");
    } catch (error) {
      setPreview(null);
      const message = error instanceof Error ? error.message : "Failed to upload image";
      orbisToast.error(message);
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(objectUrl);
      // Reset input so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    try {
      setIsUploading(true);
      await dispatch(updateProfileThunk({ profilePicture: "" })).unwrap();
      setPreview(null);
      orbisToast.success("Profile picture removed!");
    } catch {
      orbisToast.error("Failed to remove profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  const displayImage = preview || currentImage;

  return (
    <div className="avatar-upload">
      <div className="avatar-upload-wrapper" onClick={handleClick}>
        <div className="profile-avatar">{displayImage ? <img src={displayImage} alt={displayName} /> : getInitials(displayName)}</div>
        <div className="avatar-upload-overlay">{isUploading ? <Loader2 size={20} className="spinner" /> : <Camera size={20} />}</div>
      </div>

      {currentImage && !isUploading && (
        <button className="avatar-remove-btn" onClick={handleRemove} title="Remove photo">
          <X size={14} />
        </button>
      )}

      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileChange} style={{ display: "none" }} />
    </div>
  );
};
