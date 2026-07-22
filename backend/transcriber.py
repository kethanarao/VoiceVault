from faster_whisper import WhisperModel
import os

class Transcriber:
    def __init__(self, model_size: str = "base", device: str = "cpu"):
        """
        model_size options: tiny, base, small, medium, large-v3
        device: "cpu" or "cuda"
        """
        self.model_size = model_size
        print(f"Loading Whisper model: {model_size} on {device}...")
        self.model = WhisperModel(
            model_size,
            device=device,
            compute_type="int8" if device == "cpu" else "float16"
        )
        print("Model loaded successfully!")

    def transcribe(self, audio_path: str, language: str = None) -> dict:
        """
        Returns: {
            "text": full transcript,
            "segments": list of timed segments,
            "language": detected language
        }
        """
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        segments, info = self.model.transcribe(
            audio_path,
            language=language,          # None = auto-detect
            beam_size=5,
            vad_filter=True,            # removes silence
            word_timestamps=False
        )

        full_text = ""
        segment_list = []

        for segment in segments:
            full_text += segment.text + " "
            segment_list.append({
                "start": round(segment.start, 2),
                "end": round(segment.end, 2),
                "text": segment.text.strip()
            })

        return {
            "text": full_text.strip(),
            "segments": segment_list,
            "language": info.language,
            "duration": round(info.duration, 2)
        }