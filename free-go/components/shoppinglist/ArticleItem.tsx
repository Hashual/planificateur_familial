import { Article } from "@/mockapi/types";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckBox } from "../utilities/CheckBox";

type ArticleItemProps = {
    article: Article;
    listId: number;
    handleDeleteArticle: (listId: number, articleId: number) => void;
    handleCompleteArticle: (listId: number, articleId: number) => void;
};

export default function ArticleItem({ article, listId, handleDeleteArticle, handleCompleteArticle }: ArticleItemProps) {
    const getTaskStyle = (article: Article) => {
        if (article.isChecked) {
          return styles.purchasedArticle;
        }
        return styles.pendingArticle;
      };

    return (
        <View style={styles.articleItem}>
            <TouchableOpacity
            onPress={() => handleCompleteArticle(listId, article.id)}
            style={{padding: 10}}
            >
              <View style={styles.rowWithGap}>
                <CheckBox isChecked={article.isChecked}/>
                <View style={styles.shrinkableItem}>
                  <Text style={getTaskStyle(article)}>{article.quantity === 1 ? article.name : `${article.name} (${article.quantity})`}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => handleDeleteArticle(listId, article.id)}
            style={styles.deleteButtonContainer}
            >
            <Text style={styles.deleteButton}>✕</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
      borderColor: '#00796b',
      borderWidth: 1,
      padding: 10,
      marginTop: 10,
      borderRadius: 5,
      backgroundColor: '#fff',
    },
    articleItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 5,
      backgroundColor: '#ffffff',
      borderRadius: 10,
    },
    purchasedArticle: {
      textDecorationLine: "line-through",
      color: "#BDBDBD"
    },
    pendingArticle: {
      color: "#141C24",
    },
    deleteButtonContainer: {
      flex: 1,
      width: 30,
      maxWidth: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    deleteButton: {
      color: '#d32f2f',
      fontSize: 20,
      fontWeight: '900',
    },
    rowWithGap: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
    },
    shrinkableItem: {
      flexShrink: 1,
      width: "85%",
    },
});