const handleFileUpload = async (req, res) => {
    try {
      const file = req.file;
      const key = `uploads/${folderMap[req.params.type]}/${Date.now()}-${file.originalname}`;
      const fileUrl = await uploadFile(file, key);
      const signedUrl = await getSignedFileUrl(key);
      
      res.json({
        imageUrl: fileUrl,
        signedUrl: signedUrl,
        fileName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype
      });
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      res.status(500).json({ error: '파일 업로드에 실패했습니다.' });
    }
  };