# Voice Input Troubleshooting Guide

## Browser Compatibility

The voice input feature uses the Web Speech API, which has varying support across browsers:

### ✅ Supported Browsers
- **Chrome/Chromium**: Full support
- **Edge**: Full support  
- **Safari**: Limited support (iOS 14.5+)
- **Opera**: Full support

### ❌ Unsupported Browsers
- **Firefox**: No support for Web Speech API
- **Internet Explorer**: No support
- **Older browser versions**

## Common Issues and Solutions

### 1. "Microphone access denied" Error
**Cause**: Browser blocked microphone permissions
**Solutions**:
- Click the microphone icon in the address bar and allow access
- Go to browser settings → Privacy & Security → Site Settings → Microphone
- Ensure the site has microphone permissions enabled

### 2. "No microphone found" Error
**Cause**: No microphone device detected
**Solutions**:
- Check if microphone is properly connected
- Test microphone in other applications
- Restart browser after connecting microphone
- Check system audio settings

### 3. "Service not allowed" Error
**Cause**: HTTPS required for Web Speech API
**Solutions**:
- Ensure you're accessing the site via HTTPS
- For local development, use `localhost` (automatically trusted)
- Avoid using IP addresses for local testing

### 4. "Network error" Error
**Cause**: Internet connection issues
**Solutions**:
- Check internet connection
- Try refreshing the page
- Disable VPN if using one
- Check firewall settings

### 5. Voice Input Button Shows "Not Available"
**Cause**: Browser doesn't support Web Speech API
**Solutions**:
- Switch to a supported browser (Chrome, Edge, Safari)
- Update browser to latest version
- Use text input as alternative

## Browser-Specific Instructions

### Chrome/Chromium
1. Click the microphone icon in address bar
2. Select "Always allow" for this site
3. Refresh the page

### Safari
1. Go to Safari → Preferences → Websites → Microphone
2. Set permission to "Allow" for the site
3. Refresh the page

### Edge
1. Click the microphone icon in address bar
2. Select "Allow" and check "Remember this decision"
3. Refresh the page

## Testing Voice Input

1. **Click the red microphone button**
2. **Allow microphone permissions** when prompted
3. **Speak clearly** into your microphone
4. **Wait for the transcript** to appear
5. **Translation will start automatically**

## Alternative Solutions

If voice input doesn't work:
1. **Use text input**: Type your text in the textarea
2. **Try a different browser**: Switch to Chrome or Edge
3. **Check system settings**: Ensure microphone works in other apps
4. **Update browser**: Make sure you're using the latest version

## Technical Details

The voice input feature:
- Uses the Web Speech API (`SpeechRecognition`)
- Requires HTTPS or localhost
- Needs microphone permissions
- Has a 10-second timeout for safety
- Automatically stops after detecting speech
- Provides detailed error messages for troubleshooting

## Still Having Issues?

If voice input still doesn't work after trying these solutions:
1. Use the text input field instead
2. Check browser console for detailed error messages
3. Ensure you're using a supported browser
4. Verify microphone works in other applications
